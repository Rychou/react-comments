import React, {Component} from  'react'
import { Pagination, PaginationItem, PaginationLink,Button } from 'reactstrap';
import Login from './Login'
class Comment extends Component{
    constructor(){
        super();
        this.state ={
            comments:[],//用户评论数据
            pages:[],//存放<li>标签
            page:0,//总页数
            current_page:1,//当前页数
            status:false,//是否登陆状态
            token:'',
            user_name:'',//用户名
            user_ID:''
        }
    }
    judgeLogin=()=>{
        fetch('https://bird.ioliu.cn/v1?url=http://119.28.24.179:8082/user?token='+localStorage.getItem("token"),{
            method:'get'
        }).then(response=>{
            return response.json()})
            .then(result=> {
                if (Object.prototype.toString.call(result.status) === '[object Object]') {
                    const status = JSON.parse(result.status.message.response.text).status
                    this.setState({status})
                }
                else this.setState({status:result.status})
            })
    }
    componentWillMount(){
        fetch('https://bird.ioliu.cn/v1?url=http://119.28.24.179:8082/user?token='+localStorage.getItem("token"),{
            method:'get'
        })
            .then(response=>{
                return response.json()})
            .then(result=>{
                    if (result.message=="refresh token"){
                        localStorage.removeItem("token")
                        localStorage.setItem("token",result.token)
                        this.judgeLogin();
                    }
                    else {
                        if (Object.prototype.toString.call(result.status) === '[object Object]') {
                            const status = JSON.parse(result.status.message.response.text).status
                            this.setState({status})
                        }
                        else this.setState({status:result.status})
                    }
            })
    }
    componentDidMount() {
        fetch('https://bird.ioliu.cn/v1?url=http://119.28.24.179:8081/comments?page=0',{
            method:'get'
        })
            .then(response=>{
                return response.json()
            }).then(result=>{
                    const comments = result.data
                    this.setState({
                        comments
                    })
                })
        fetch('https://bird.ioliu.cn/v1?url=http://119.28.24.179:8081/page',{
            method:'get'
        })
            .then(response=>{
                return response.json()
            }).then(result=>{
                    const page = result.count
                    this.setState({page})
                })
    }
    //发表评论功能
    handleClick = () =>{
        if(this.state.status){
            const comment_content= this.refs.comment_content.value.trim();
            let formData = new FormData();
            formData.append("comment_content",comment_content);
            formData.append("user_name",localStorage.getItem("user_name"));
            formData.append("user_ID",localStorage.getItem("user_ID"));
            fetch('http://119.28.24.179:8081/authUser',{
                method:'POST',
                mode:'cors',
                headers: {
                    Authorization: 'Bearer '+localStorage.getItem("token"),
                },
                body: formData
            }).then(response=>{
                console.log(response)
                response.json().then(result=>{
                    if (result.status==true){
                        alert("发表成功！")
                        this.refs.comment_content.value = '';//发表成功则清除评论框内容
                        //如果在最后一页，用户发表评论，则获取最后一页的评论数据，更新显示
                        if(this.state.current_page==this.state.page-1){
                            fetch('http://119.28.24.179:8081/comments?page='+this.state.current_page,{
                                method:'get'
                            }).then(response=>{
                                return response.json()
                            }).then(result=>{
                                const comments = result.data
                                this.setState({comments})
                            })
                        }
                    }

                })
            }).catch(error=>{
                console.log(error)
            })
        }
        else alert("发表失败！请登陆")
    }
    //分页功能
    changePage = (e,index) =>{
        if (index>0&&index<this.state.page){
            fetch('https://bird.ioliu.cn/v1?url=http://119.28.24.179:8081/comments?page='+index,{
                method:'get'
            }).then(response=>{
                response.json().then(result=>{
                    const comments = result.data
                    this.setState({
                        comments,
                        current_page:index
                    })
                })
            })
        }
    }
    //阻止表单的默认提交行为
    handleSubmit = e=>{
        e.preventDefault();
    }
    //在Login组件中获取登陆用户的基本信息
    getUsermsg = (token,status)=>{
        this.setState({token,status})
    }
    //注销
    handleLogout = ()=>{
        if (window.confirm("确定要注销吗？")){
            localStorage.clear()
            this.judgeLogin()
        }
    }

    render(){
        const {comments} = this.state
        //分页组件
        const pages = page=>{
            let li = [];
            for (let i=0;i<page;i++){
                if(i==0){
                    li.push(
                        <PaginationItem key={i} onClick={(e)=>(e.preventDefault(),this.changePage(e,this.state.current_page-1))}>
                            <PaginationLink previous href="#" />
                        </PaginationItem>
                    );
                    i++;
                }
                li.push(
                        <PaginationItem active={this.state.current_page==i} key={i} onClick={(e)=>(e.preventDefault(),this.changePage(e,i))}>
                            <PaginationLink href="#">
                                {i}
                            </PaginationLink>
                        </PaginationItem>
                )
                if(i==page-1){
                    li.push(
                        <PaginationItem key={i+1} onClick={(e)=>(e.preventDefault(),this.changePage(e,this.state.current_page+1))}>
                            <PaginationLink next href="#" />
                        </PaginationItem>
                    )
                }
            }
            return li;
        }
        //登陆组件
        const login = ()=>{
            if (!this.state.status)
                return <Login size="md" getUsermsg={this.getUsermsg}/>
            else return <Button onClick={this.handleLogout}>注销</Button>
        }
        const userName= ()=>{
            return <h3>{localStorage.getItem("user_name")}</h3>

        }
            return(
                <div className="container" style={{width:'500px',position:'relative'} }>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            {userName()}
                            <textarea className="form-control" placeholder="留下点痕迹吧！" required rows="5" ref="comment_content"></textarea>
                        </div>
                        <Button type="submit" style={{cursor:'pointer'}} onClick={this.handleClick} className="btn btn-primary">发表评论</Button>
                    </form>
                    {
                        login()
                    }
                    <Pagination>
                        {pages(this.state.page)}
                    </Pagination>
                    <div className="list-group ">
                        {
                            comments.length?comments.map((comment,index)=>
                                    (
                                        <div className="list-group-item row" key={index}>
                                            <div>
                                                <p>用户名:{comment.user_name}</p>
                                                <p>{comment.comment_content}</p>
                                                <p>{comment.comment_time}</p>
                                            </div>
                                        </div>
                                    )
                                ):void 0
                        }
                    </div>
                </div>
            )
        }
}

export default Comment


