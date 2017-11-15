import React, {Component} from  'react'
import ReactDOM from 'react-dom';
import axios from 'axios'
class Comment extends Component{
    constructor(){
        super()
        this.state ={
            topic_id:1,
            comments:[],
            userID:'',
            commentContent:''
        }
    }
    //'http://changyan.sohu.com/api/2/topic/load?client_id='+client_id+'&topic_url='+topic_url+'&topic_source_id=Js中splice()于slice()的区别'
    componentDidMount(){
        const topic_url = this.props.topic_url
        const client_id = this.props.client_id
        axios.get('https://bird.ioliu.cn/v1?url='+'http://changyan.sohu.com/api/2/topic/load?client_id='+client_id+'&topic_url&topic_source_id=Js中splice()于slice()的区别')
            .then((response)=>{
                console.log(response)
                this.setState({
                    topic_id:response.data.topic_id
                })
                const topic_id = this.state.topic_id
                axios.get('https://bird.ioliu.cn/v1?url='+'http://changyan.sohu.com/api/2/topic/comments?client_id='+client_id+'&topic_id='+topic_id)
                    .then((response)=>{
                        console.log(response)
                        this.setState({
                            comments:response.data.comments
                        })
                    }).catch((error)=>{
                    console.log(error)
                });
                console.log(this.state.topic_id)
            }).catch((error)=>{
            console.log(error)
        });

    }
    handleClick = () =>{
        const userID= this.refs.userID.value.trim()
        const commentContent = this.refs.commentContent.value.trim()
        this.setState({userID,commentContent})
        axios.post('http://changyan.sohu.com/api/2/comment/submit?client_id=cytj08ckR&content=asdasd&topic_id=4059692050')
            .then((response)=>{
            console.log(response)
        }).catch((error)=>{
            console.log(error)
    })
    }
    render(){
        console.log(this.state.comments)
        const {comments} = this.state
        //if (comments!=null){
            return(
                <div className="container" style={{width:'500px',position:'relative'} }>
                    <div className="list-group ">
                        {
                            comments.map((comment,index)=>{
                                return(
                                    <div className="list-group-item row" key={index}>
                                        {/*<img  src={comment.passport.img_url}/>*/}
                                        <div >
                                            <p>用户名:{comment.passport.nickname}</p>
                                            <p>{comment.content}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <form /*action={"http://changyan.sohu.com/api/2/comment/submit?client_id=cytj08ckR&topic_id=4059692050&content="+this.state.commentContent+"&nickname="+this.state.userID} method="post"*/>
                            <div className="form-group">
                                <label>
                                    用户名:
                                </label>
                                <input type="text" className="form-control" placeholder="用户名" ref="userID"/>
                                <label>评论:</label>
                                <textarea className="form-control" placeholder="留下点痕迹吧！" rows="5" ref="commentContent"></textarea>
                            </div>
                            <input type="button" className="btn btn-primary" onClick={this.handleClick} value="发表评论"/>
                        </form>
                    </div>
                </div>
            )
        }


   // }
}
var client_id = 'cytj08ckR'
var topic_url = 'https://xxxsimons.github.io/2017/11/06/Javascript/'

ReactDOM.render(<Comment client_id={client_id} topic_url={topic_url}/>, document.getElementById('root'));
