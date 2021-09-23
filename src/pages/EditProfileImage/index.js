import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Menu } from '../../Components/Menu'

import api from '../../config/configApi'

export const EditProfileImage = () => {

    const [image, setImage] = useState('');

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
        };
        
        await api.put('/edit-profile-image', formData, headers)
        .then((response) => {
            setStatus({
                type: 'success',
                mensagem: response.data.mensagem
            });
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

    return (
        <div>
            <Menu />
            <h1>Editar Imagem do Perfil</h1>

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

            <form onSubmit={editUser}>
                <label>Imagem*:</label>
                <input type="file" name="image" onChange={e => setImage(e.target.files[0])} /><br /><br />

                * Campo obrigatório<br /><br />

                <button type="submit">Salvar</button>
            </form>
        </div>
    )
}