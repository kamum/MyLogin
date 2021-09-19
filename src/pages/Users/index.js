import React, { useEffect, useState } from 'react';

import { serverDeleteUser } from '../../services/serverDeleteUser';
import api from '../../config/configApi';

import { Link, useLocation } from 'react-router-dom'

export const Users = () => {

    const { state } = useLocation();;

    const [data, setData] = useState([]);

    const [page, setpage] = useState("");
    const [lastPage, setLestPage] = useState("");

    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : ""
    })

    const getUsers = async (page) => {

        if (page === undefined) {
            page = 1;
        }
        setpage(page);

        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }

        await api.get("/users/" + page, headers)
            .then((response) => {
                setData(response.data.users);
                setLestPage(response.data.lastPage)
            }).catch((err) => {
                if (err.response) {
                    setStatus({
                        type: 'error',
                        mensagem: err.response.data.mensagem
                    });
                } else {
                    setStatus({
                        type: 'error',
                        mensagem: 'Erro: tente mais tarde!'
                    });
                }
            });
    }

    useEffect(() => {
        getUsers();
    }, []);

    const deleteUser = async (idUser) => {

        const response = await serverDeleteUser(idUser);

        if (response) {
            setStatus({
                type: response.type,
                mensagem: response.mensagem
            });
            getUsers();
        } else {
            setStatus({
                type: "error",
                mensagem: "Erro: Tente mais tarde."
            });
        }
    }


    return (
        <>

            <Link to="/dashboard">Dashboard</Link><br />
            <Link to="/users">Usuários</Link><br />

            <h1>Listar Usuário</h1>

            <Link to="/add-user"><button type="button">Cadastrar usuário</button></Link><br /><hr />

            {status.type === 'error' ? <p>{status.mensagem}</p> : ""}
            {status.type === 'success' ? <p>{status.mensagem}</p> : ""}

            {data.map(user => (
                <div key={user.id}>
                    <span>{user.id}</span><br />
                    <span>{user.name}</span><br />
                    <span>{user.email}</span><br /><br />
                    <Link to={"/view-user/" + user.id}><button type="button">Visualizar</button></Link>{' '}
                    <Link to={"/edit-user/" + user.id}><button type="button">Editar</button></Link>{' '}
                    <Link to={"#"}>
                        <button type="button" onClick={() => deleteUser(user.id)}>Apagar</button>
                    </Link>
                    <hr />

                </div>
            ))}

            {page !== 1 ? <button type="button" onClick={() => getUsers(1)}>Primeira</button> : <button type="button" disabled>Primeira</button> }{" "}
            
            {page !== 1 ? <button type="button" onClick={() => getUsers(page - 1)}>{page - 1}</button> : ""}{" "}

            <button type="button" disabled>{page}</button>{" "}

            {page + 1 <= lastPage ? <button type="button" onClick={() => getUsers(page + 1)}>{page + 1}</button> : ""}{" "}

            {page !== lastPage ? <button type="button" onClick={() => getUsers(lastPage)}>Última</button> : <button type="button" disabled>Última</button>}{" "}
        </>
    )

}