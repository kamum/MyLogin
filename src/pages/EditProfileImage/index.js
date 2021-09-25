import React, { useState, useEffect} from 'react'
import { Redirect } from 'react-router-dom'
import { Menu } from '../../Components/Menu'

import api from '../../config/configApi'

export const EditProfileImage = () => {

    const [image, setImage] = useState('');
    const [addressImage, setAddressImage] = useState('');
    
    //obetendo imagem do local storage
    //const [addressImage, setAddressImage] = useState(localStorage.getItem('image'));

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
            localStorage.setItem('image', response.data.image)
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

    useEffect(() => {
        const getUser = async () => {

            const headers = {
                'headers': {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }

            await api.get("/view-profile/", headers)
                .then((response) => {
                    if (response.data.user) {
                        setAddressImage(response.data.addressImage);
                    } else {
                        setStatus({
                            type: 'warning',
                            mensagem: "Erro: Usuário não encontrado!"
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
    }, []);


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

                {/* banco de dados */}
                {/*image ? <img src={URL.createObjectURL(image)} alt="Imagem do usuário" width="150" height="150" /> : <img src={addressImage} alt="Imagem do usuário" width="150" height="150" />*/}
                
                {image ? <img src={URL.createObjectURL(image)} alt="Imagem do usuário" width="150" height="150" /> : <img src={addressImage} alt="Imagem do usuário" width="150" height="150" />}
                <br /><br />

                * Campo obrigatório<br /><br />

                <button type="submit">Salvar</button>
            </form>
        </div>
    )
}