/**
 * Created by Rychou on 2017/11/24.
 */
import React, {Component} from  'react'
import {Container, Button, Modal, ModalHeader, ModalBody,Form,FormGroup, Label, Input,FormFeedback,ModalFooter} from 'reactstrap'

class Register extends Component{
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            user_Email:'',
            user_password:'',
            user_name:''
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    handleChange = (e)=>{
        var newState = {};
        newState[e.target.name] = e.target.value;
        this.setState(newState)
    };
    handleRegister=(e)=>{
        fetch('https://bird.ioliu.cn/v1?url=http://119.28.24.179:8082/register',{
            method:'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_Email: this.state.user_Email,
                user_password: this.state.user_password,
                user_name: this.state.user_name
            })
        }).then(response=>{
            response.json().then(result=>{
                console.log(result)
            })
        });
        e.preventDefault();
    }
    render(){
        return(
            <Container>
                <Button color="primary" style={{cursor:'pointer'}} onClick={this.toggle}>注册</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} >
                    <ModalHeader toggle={this.toggle}>注册</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleRegister}>
                            <FormGroup>
                                <Input type="text" name="user_name" onChange={this.handleChange} value={this.state.user_name} required placeholder="用户名"/>
                            </FormGroup>
                            <FormGroup>
                                <Input type="email" name="user_Email" onChange={this.handleChange} value={this.state.user_Email} required placeholder="邮箱"/>
                            </FormGroup>
                            <FormGroup>
                                <Input type="password" name="user_password" onChange={this.handleChange} value={this.state.user_password} placeholder="密码"  required/>
                            </FormGroup>
                            <ModalFooter>
                                <Button color="primary" size="md" block>注册</Button>{' '}
                            </ModalFooter>
                        </Form>
                    </ModalBody>
                </Modal>
            </Container>
        )
    }
}
export default Register

