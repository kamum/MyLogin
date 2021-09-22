import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';

import api from '../../config/configApi';

export const RecoverPassword = () => {

    const [user, setUser] = useState({
        email: "",
        url: "http://localhost:3000/update-password/"
    });

    const [status, setStatus] = useState({
        type: "",
        mensagem: "",
        loading: false
        
    });

    const valorInput = e => setUser({ ...user, [e.target.name]: e.target.value });
    
    const recoverPassword = async e => {
        e.preventDefault();
        setStatus({
            loading: true
        });

        const headers = {
            'Content-Type': 'application/json'
        }
        await api.post("/recover-password", user, { headers })

        .then((response) => {
            
            setStatus({
                type: 'success',
                mensagem: response.data.mensagem,
                loading: false
            });
        }).catch((err) => {
            if (err.response) {
                setStatus({
                    type: 'error',
                    mensagem: err.response.data.mensagem,
                    loading: false
                });
            } else {
                setStatus({
                    type: 'error',
                    mensagem: "Erro: tente mais tarde!",
                    loading: false
                });
            }
        });
    }

    return (
        <div>
           <h1>Recuperar Senha</h1>

            {status.type === 'error' ? <p>{status.mensagem}</p> : ""}
            {status.type === 'success' ? <p>{status.mensagem}</p> : ""}

            {status.type === 'success' ? 
                <Redirect to={{
                    pathname: '/',
                    state: {
                        type: 'success',
                        mensagem: status.mensagem
                    }
                }} /> 
            : ""}

           <form onSubmit={recoverPassword}>
                <label>Email: </label>
                <input type="text" name="email" placeholder="Digite o e-mail" onChange={valorInput}/><br /><br />

                {status.loading ? <button type="submit" disabled>Enviando...</button> : <button type="submit">Enviar</button>} <br /><br />

            </form>
            <Link to="/add-user-login">Cadastrar</Link>{" - "}
            Retorne para a página de <Link to="/">login</Link>
        </div>
    );
};