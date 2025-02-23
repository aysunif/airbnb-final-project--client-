import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from "js-cookie"
import { useDispatch } from 'react-redux'
import { setLogin } from '../../redux/state'
import { saveUserToStorage } from '../../utils/localStorage'
import { Helmet } from 'react-helmet-async'

const LoginSuccess = () => {
   let location = useLocation()
   const queryParams = new URLSearchParams(location.search)
//    console.log(queryParams)
   const token = queryParams.get("token")
   const user = JSON.parse(queryParams.get("user"))
  //  console.log(token)
  Cookies.set("token", token, { expires: 7, path: "/" });
  const navigate = useNavigate();
  const dispatch = useDispatch()
  console.log(user)

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  if (token) {
          dispatch(
            setLogin({
              user: user,
              token: token,
            })
          );
          // navigate("/");
          saveUserToStorage(token);
          // toast.success("Giriş uğurlu oldu!");
          navigate("/");
        }
  return (
    <>
    <Helmet>
           <title>Airbnb | LoginSuccess</title>
           <meta name="description" content="loginsuccess page" />
         </Helmet>
   <div>LoginSuccess</div>
    </>
  )
}

export default LoginSuccess