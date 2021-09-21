import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import * as yup from 'yup';

import api from '../../config/configApi';

export const AddUserLogin = () => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [status, setStatus] = useState({
        type: '',
        mensagem: ''
    });

    const valueInput = e => setUser({ ...user, [e.target.name]: e.target.value });

    const addUser = async e => {
        e.preventDefault();

        if (!(await validate())) return;

        const headers = {
            'headers': {
                'Content-Type': 'application/json'
            }
        };

        await api.post('/add-user-login', user, headers)
        .then((response) => {
            setStatus({
                type: 'redSuccess',
                mensagem: response.data.mensagem
            });
        }).catch((err) => {
            if (err.response) {
                setStatus({
                    type: 'error',
                    mensagem: err.response.data.mensagem
                });
            } else {
                setStatus({
                    type: 'error',
                    mensagem: "Erro: Tente novamente mais tarde!"
                });
            }
        });

    }    

    async function validate() {
        let schema = yup.object().shape({
            password: yup.string("Erro: Necessário preencher o campo senha!")
                .required("Erro: Necessário preencher o campo senha!")
                .min(6, "Erro: A senha deve ter no mínimo 6 caracteres!"),
            email: yup.string("Erro: Necessário preencher o campo e-mail!")
                .email("Erro: Necessário preencher o campo e-mail!")
                .required("Erro: Necessário preencher o campo e-mail!"),
            name: yup.string("Erro: Necessário preencher o campo nome!")
                .required("Erro: Necessário preencher o campo nome!")
        });

        try {
            await schema.validate({
                name: user.name,
                email: user.email,
                password: user.password,
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
            <h1>Cadastrar Usuário</h1>

            {status.type === 'error' ? <p>{status.mensagem}</p> : ""}
            {status.type === 'redSuccess' ?
                <Redirect to={{
                    pathname: '/',
                    state: {
                        type: "success",
                        mensagem: status.mensagem
                    }
                }} />
                : ""}

            <form onSubmit={addUser}>
                <label>Nome*: </label>
                <input type="text" name="name" placeholder="Nome completo do usuário" onChange={valueInput} /><br /><br />

                <label>E-mail*: </label>
                <input type="email" name="email" placeholder="Melhor e-mail do usuário" onChange={valueInput} /><br /><br />

                <label>Senha*: </label>
                <input type="password" name="password" placeholder="Senha para acessar o sistema" autoComplete="on" onChange={valueInput} /><br /><br />

                * Campo obrigatório<br /><br />

                <button type="submit">Cadastrar</button><br /><br />
            </form>

            <Link to="/">Login</Link>

        </div>
    );
};