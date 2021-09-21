import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import api from '../../config/configApi'

import {Menu} from '../../Components/Menu'

import {Link, Redirect} from 'react-router-dom'

export const EditProfilePassword = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const [status, setStatus] = useState({
        type: '',
        mensagem: ''
    });

    const editUser = async e => {
        e.preventDefault();

        if (!(await validate())) return;

        const headers = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        
        await api.put('/edit-profile-password', { password }, headers)

        .then((response) => {
            setStatus({
                type: 'success',
                mensagem: response.data.mensagem
            })

        }).catch((err) => {
            if(err.response){
                setStatus({
                    type: 'error',
                    mensagem: err.response.data.mensagem
                })

            }else{
                setStatus({
                    type: 'error',
                    mensagem: "Erro: Tente mais tarde."
                })

            }
        });

    }

    

    useEffect(() => {
        const getUser = async () => {

            const headers = {
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }

            await api.get("/view-profile", headers)
                .then((response) => {
                    if (response.data.user) {
                        setName(response.data.user.name)
                        setEmail(response.data.user.email)
                    } else {
                        setStatus({
                            type: 'warning',
                            mensagem: 'Usuário não encontrado.'
                        });
                    }

                }).catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: 'warning',
                            mensagem: err.response.data.mensagem
                        });
                    } else {
                        setStatus({
                            type: 'warning',
                            mensagem: 'Erro: Tente mais tarde.'
                        });
                    }
                })
        }
        getUser();
    }, [])

    async function validate() {
        let schema = yup.object().shape({

            password: yup.string("Erro: Necessário preencher o campo senha!")
                .required("Erro: Necessário preencher o campo senha!")
                .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
        })

        try {
            await schema.validate({
                password,
            });
            return true;
        } catch (err) {
            setStatus({
                type: 'error',
                mensagem: err.errors
            });
            return false;
        }
    }    

    return (
        <div>
            <Menu />

            <h1>Editar senha</h1>

            <Link to="/view-profile"><button type="button">Perfil</button></Link><br/>

            {status.type === 'warning' ? 
                <Redirect to={{
                    pathname: '/login',
                    state: {
                        type: "error",
                        mensagem: status.mensagem
                    }
                }} />
            : ""}

            {status.type === 'success' ? 
                <Redirect to={{
                    pathname: '/view-profile',
                    state: {
                        type: 'success',
                        mensagem: status.mensagem
                    }
                }} /> 
            : ""}
            {status.type === 'error' ? <p>{status.mensagem}</p> : ""}


            <hr />
            <form onSubmit={editUser}>

                <label>Nome:{name}</label><br/>
                <label>Email:{email}</label><br/><br/>
                
                <label>Password*:</label>
                <input type="password" name="password" placeholder="password" autoComplete="on" onChange={text => setPassword(text.target.value)}/><br/><br/>
                
                * Campo obrigatório<br /><br />

                <button type="submit">Salvar</button>

            </form>
        </div>
    )
}