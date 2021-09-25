import React, { useEffect, useState } from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';

import { Menu } from '../../Components/Menu';
import { serverDeleteUser } from '../../services/serverDeleteUser';
import api from '../../config/configApi';

export const ViewUser = (props) => {

    const { state } = useLocation();

    const [data, setData] = useState('');
    const [id] = useState(props.match.params.id);
    const [addressImage, setAddressImage] = useState('');

    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : ""
    });

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
                        setAddressImage(response.data.addressImage);
                        setData(response.data.user);
                    } else {
                        setStatus({
                            type: 'redError',
                            mensagem: "Erro: Usuário não encontrado!"
                        });
                    }

                }).catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: 'redError',
                            mensagem: err.response.data.mensagem
                        });
                    } else {
                        setStatus({
                            type: 'redError',
                            mensagem: "Erro: Tente mais tarde!"
                        });
                    }
                })
        }

        getUser();
    }, [id]);

    const deleteUser = async (idUser) => {
        const response = await serverDeleteUser(idUser);

        if (response) {
            if (response.type === "success") {
                setStatus({
                    type: "redSuccess",
                    mensagem: response.mensagem
                });
            } else {
                setStatus({
                    type: response.type,
                    mensagem: response.mensagem
                });
            }
        } else {
            setStatus({
                type: "redError",
                mensagem: "Erro: Tente mais tarde!"
            });
        }
    }

    return (
        <div>
            <Menu />

            <h1>Detalhes do Usuário</h1>

            <Link to="/users"><button type="button">Listar</button></Link>{" "}
            <Link to={"/edit-user/" + data.id}><button type="button">Editar</button></Link>{" "}
            <Link to={"/edit-user-password/" + data.id}><button type="button">Editar Senha</button></Link>{" "}
            <Link to={"/edit-user-image/" + data.id}><button type="button">Editar Imagem</button></Link>{" "}
            <Link to={"#"}><button type="button" onClick={() => deleteUser(data.id)}>Apagar</button></Link>
            

            {status.type === 'redSuccess' ?
                <Redirect to={{
                    pathname: '/users',
                    state: {
                        type: "success",
                        mensagem: status.mensagem
                    }
                }} /> : ""}

            {status.type === 'redError' ?
                <Redirect to={{
                    pathname: '/users',
                    state: {
                        type: "error",
                        mensagem: status.mensagem
                    }
                }} /> : ""}
            {status.type === 'error' ? <p>{status.mensagem}</p> : ""}
            {status.type === 'success' ? <p>{status.mensagem}</p> : ""}

            <hr />
            
            <span>{data.id}</span><br />
            <span>{<img src={addressImage} alt="Imagem do Usuário" width="150" height="150" />}</span><br />
            <span>{data.name}</span><br />
            <span>{data.email}</span><br />
        </div>
    )
}