import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { Menu } from '../../Components/Menu';
import api from '../../config/configApi';
import { serverDeleteUser } from '../../services/serverDeleteUser';

export const EditUserImage = (props) => {

    const [image, setImage] = useState('');
    const [id] = useState(props.match.params.id);
    const [addressImage, setAddressImage] = useState('');

    const [status, setStatus] = useState({
        type: '',
        mensagem: ''
    });

    const editUser = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);

        const headers = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }

        await api.put("/edit-user-image/" + id, formData, headers)
            .then((response) => {
                setStatus({
                    type: 'success',
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
                        mensagem: 'Erro: Tente mais tarde!'
                    });
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
                        setAddressImage(response.data.addressImage);
                    } else {
                        setStatus({
                            type: 'warning',
                            mensagem: "Erro: Usu??rio n??o encontrado!"
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
                    type: 'success',
                    mensagem: response.mensagem
                });
            } else {
                setStatus({
                    type: "error",
                    mensagem: response.mensagem
                });
            }
        } else {
            setStatus({
                type: 'error',
                mensagem: 'Erro: Tente mais tarde!'
            });
        }
    }

    return (
        <div>
            <Menu />

            <h1>Editar Usu??rio</h1>

            <Link to="/users"><button type="button">Listar</button></Link>{" "}
            <Link to={"/view-user/" + id}><button type="button">Visualizar</button></Link>{" "}
            <Link to={"#"}><button type="button" onClick={() => deleteUser(id)}>Apagar</button></Link>
            <br />

            {status.type === 'warning' ?
                <Redirect to={{
                    pathname: '/users',
                    state: {
                        type: "error",
                        mensagem: status.mensagem
                    }
                }} /> : ""}
            {status.type === 'success' ? <Redirect to={{
                pathname: '/view-user/' + id,
                state: {
                    type: "success",
                    mensagem: status.mensagem
                }
            }} /> : ""}
            {status.type === 'error' ? <p style={{ color: "#ff0000" }}>{status.mensagem}</p> : ""}

            <hr />
            <form onSubmit={editUser}>
                <label>Imagem*: </label>
                <input type="file" name="image" onChange={e => setImage(e.target.files[0])} /><br /><br />

                {image ? <img src={URL.createObjectURL(image)} alt="Imagem do usu??rio" width="150" height="150" /> : <img src={addressImage} alt="Imagem do usu??rio" width="150" height="150" />}
                <br /><br />

                * Campo obrigat??rio<br /><br />

                <button type="submit">Salvar</button>
            </form>

        </div>
    )
}