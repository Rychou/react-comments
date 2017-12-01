import React, {Component} from  'react'
import {Container, Button, Modal, ModalHeader, ModalBody,Form,FormGroup, Input} from 'reactstrap'
import Register from './Register'

class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            user_Email:'',
            user_password:''
        };

        this.toggle = this.toggle.bind(this);
    }
    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    handleLogin = ()=>{
        console.log(this.state.user_Email+this.state.user_password)
        fetch('https://bird.ioliu.cn/v1?url=http://119.28.24.179:8082/login',{
            method:'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                user_Email:this.state.user_Email,
                user_password: this.state.user_password
            })
        }).then(response=>{
            response.json().then(result=>{
                if(result.status){
                    this.props.getUsermsg(result.token,result.status)
                    localStorage.setItem("token",result.token)
                    localStorage.setItem("user_name",result.name)
                    localStorage.setItem("user_ID",result.ID)
                    localStorage.setItem("status",result.status)
                }
                else if (result.error){
                    alert("账号或者密码错误!")
                }
            })
        })
    }
    handleSubmit = e=>{
        e.preventDefault();
    }
    handleChange = e=>{
        var newState={}
        newState[e.target.name] = e.target.value
        this.setState(newState)
    }
    render(){
            return(
                <Container>
                    <Button style={{cursor:'pointer'}} color="danger" onClick={this.toggle}>登陆</Button>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>登陆</ModalHeader>
                        <ModalBody>
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Input type="email" name="user_Email" id="email" required placeholder="输入邮箱" onChange={this.handleChange}/>
                                </FormGroup>
                                <FormGroup>
                                    <Input type="password" name="user_password" id="psw" placeholder="密码" ref="psw" required onChange={this.handleChange}/>
                                </FormGroup>
                                <Button color="primary" type="summit" size="md" block style={{cursor:'pointer'}} onClick={this.handleLogin}>登陆</Button>
                            </Form>
                        </ModalBody>
                        <Register/>
                    </Modal>
                </Container>
            )
        }
}
export default Login