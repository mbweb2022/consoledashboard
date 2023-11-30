
import styled from 'styled-components';
import backgroundImage from '../../assets/loginbackground.jpg';
import logoImage from "../../assets/logo2.png"

export const BackgroundComponent = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  filter: blur(8px); /* Aplica el filtro de desenfoque solo al fondo */
`;


export const Grid = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  height: 100vh; /* Ajusta la altura del Grid según tus necesidades */
`;
export const LoginCard = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  border: 2px solid lightblue;
  padding: 20px;
  text-align: center;
  width: 25vw;
  height: 50vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  &:hover,
  &:focus,
  &:active {
    color: rgb(0, 0, 255);
    border-color: rgb(115, 115, 225);
  }
`;

export const Logo = styled.div`
  background-image: url(${logoImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center; /* Centra la imagen horizontalmente */
  width: 20vw;
  height: 15vh;
  display: inline-block;
  
`;

export const Title = styled.h2`
  font-family: Arial, sans-serif; /* Cambia la fuente aquí */
  font-size: 1.25rem;
`;

export const FormInput = styled.input`
  width: 15vw;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: inline-block;
  margin-bottom: 20px;
  font-size: 1vw;
  margin: 10px auto; 
  
`;

export const FormButton = styled.button`
  width: 50%;
  padding: 0.5vw;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.15rem;
  margin-top: 10px;
`;
