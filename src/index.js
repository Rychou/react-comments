import React, {Component} from  'react'
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

class Comment extends Component{
    constructor(){
        super();
        this.state ={
            comments:[],//用户评论数据
            user_name:'',//用户名
            comment_content:'',
            pages:[],//存放<li>标签
            page:0,//总页数
            current_page:0//当前页数
        }

    }
    componentDidMount() {
        axios.get('http://119.28.24.179:8081/comments?page=0')
            .then((response) => {
                console.log(response)
                const comments = response.data.data
                this.setState({
                    comments
                })
            }).catch((error) => {
            console.log(error)
        })
        axios.get('https://bird.ioliu.cn/v1?url=http://119.28.24.179:8081/page')
            .then((response)=>{
                console.log(response)
                const page = response.data.count
                // const pages = this.state.pages
                // for (let i=0;i<page;i++){
                //     pages.push(1)
                // }
                this.setState({page})
            }).catch((error)=>{
            console.log(error)
        })
    }
    handleClick = () =>{
        const user_name= this.refs.user_name.value.trim()
        const comment_content= this.refs.comment_content.value.trim()
        axios.post('https://bird.ioliu.cn/v1?url=http://119.28.24.179:8081/comment',{
            user_name:user_name,
            comment_content:comment_content,
            user_ID:123123
        })
            .then((response)=>{
            console.log(response)
                if (response.data.msg==true){
                    alert("发表成功！")
                    //如果在最后一页，用户发表评论，则获取最后一页的评论数据，更新显示
                    axios.get('http://119.28.24.179:8081/comments?page='+this.state.current_page)
                        .then((response) => {
                            console.log(response)
                            const comments = response.data.data
                            this.setState({
                                comments
                            })
                        }).catch((error) => {
                        console.log(error)
                    })
                }
                else alert("发表失败！")
        }).catch((error)=>{
            console.log(error)
    })
    }
    //分页功能
    changePage = (e,index) =>{
        axios.get('http://119.28.24.179:8081/comments?page='+index)
            .then((response) => {
                const comments = response.data.data
                this.setState({
                    comments,
                    current_page:index
                })
            }).catch((error) => {
            console.log(error)
        })
    }
    render(){
        const {comments} = this.state
        const lis = page=>{
            let li = [];
            for (let i=0;i<page;i++){
                li.push(
                        <PaginationItem key={i+1} onClick={(e)=>(e.preventDefault(),this.changePage(e,i))}>
                            <PaginationLink href="#">
                                {i+1}
                            </PaginationLink>
                        </PaginationItem>
                )
            }
            return li;
        }
            return(
                <div className="container" style={{width:'500px',position:'relative'} }>
                    <form>
                        <div className="form-group">
                            <label>
                                用户名:
                            </label>
                            <input type="text" name="user_name" className="form-control" placeholder="用户名" ref="user_name"/>
                            <label>评论:</label>
                            <textarea className="form-control" name="comment_content" placeholder="留下点痕迹吧！" rows="5" ref="comment_content"></textarea>
                        </div>
                        <input type="reset" style={{cursor:'pointer'}} onClick={this.handleClick} className="btn btn-primary" value="发表评论"/>
                    </form>
                    <Pagination>
                        {lis(this.state.page)}
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

ReactDOM.render(<Comment/>, document.getElementById('root'));
