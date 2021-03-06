import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import api from '../../config/configApi'

import {Menu} from '../../Components/Menu'

import {Link, Redirect} from 'react-router-dom'

export const EditUser = (props) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [id] = useState(props.match.params.id);

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
        
        await api.put('/user', {id, name, email}, headers)
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

            await api.get("/user/" + id, headers)
                .then((response) => {
                    if (response.data.user) {
                        setName(response.data.user.name)
                        setEmail(response.data.user.email)
                    } else {
                        setStatus({
                            type: 'warning',
                            mensagem: 'Usu??rio n??o encontrado.'
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
    }, [id])

    async function validate() {
        let schema = yup.object().shape({
            email: yup.string("Erro: Necess??rio preencher o campo email!")
                .required("Erro: Necess??rio preencher o campo email!"),
            name: yup.string("Erro: Necess??rio preencher o campo nome!")
                .required("Erro: Necess??rio preencher o campo nome!")

        })

        try {
            await schema.validate({
                name,
                email,
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

            <h1>Editar Usu??rio</h1>

            <Link to="/users"><button type="button">Listar</button></Link><br/>

            {status.type === 'warning' ? 
                <Redirect to={{
                    pathname: '/users',
                    state: {
                        type: "error",
                        mensagem: status.mensagem
                    }
                }} />
            : ""}

            {status.type === 'success' ? 
                <Redirect to={{
                    pathname: '/users',
                    state: {
                        type: 'success',
                        mensagem: status.mensagem
                    }
                }} /> 
            : ""}
            {status.type === 'error' ? <p>{status.mensagem}</p> : ""}


            <hr />
            <form onSubmit={editUser}>
                <label>Nome*:</label>
                <input type="text" name="name" placeholder="Nome Completo Do usu??rio" value={name} onChange={text => setName(text.target.value)}/><br/><br/>
                
                <label>Email*:</label>
                <input type="email" name="email" placeholder="Informe o email" value={email} onChange={text => setEmail(text.target.value)}/><br/><br/>
                
                * Campo obrigat??rio<br /><br />

                <button type="submit">Salvar</button>

            </form>
        </div>
    )
}