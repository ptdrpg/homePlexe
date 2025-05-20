import loginPic from "~/assets/cassette.jpg"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import { inputBaseClasses } from '@mui/material/InputBase';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useLayoutEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm } from "react-hook-form";
import { LoginService } from "~/service/login";
import type { logintype } from "~/service/types";
import { useNavigate } from "react-router";
import { isTokenValid } from "~/service/axios";
import { decodePaylod } from "~/service/decode";

function Login() {
  const loginService = new LoginService()
  const { register, handleSubmit, reset } = useForm<logintype>()
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useLayoutEffect(()=> {
    if (isTokenValid()) {
      const decoded = decodePaylod()
      if (decoded) {
        decoded.role == 'admin'? navigate("/dash") : navigate('/movies')
        reset()
      }
    }
  },[])

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = async (data: logintype) => {
    try {
      const res = await loginService.login(data)
      if (res) {
        const decoded = decodePaylod()
        if (decoded) {
          decoded.role == 'admin'? navigate("/dash") : navigate('/movies')
          reset()
        }
      }
    } catch (error) {
      reset()
      alert("your account has been desabled");
    }
  }

  return (
    <div className="w-[100%] h-[100vh] grid grid-cols-2">
      <img src={loginPic} alt="loginpic" className="w-[100%] h-[100vh] object-cover" />
      <div className="flex align-center justify-center p-[1%]">
        <div className="flex flex-col items-center justify-center gap-[10%] w-[75%]">
          <h1 className="text-6xl font-black text-center text-amber-400">Welcome to <br /> HomePlexe</h1>
          <form className="flex flex-col gap-4 mt-4 w-[100%]" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              id="outlined-suffix-shrink"
              label="username"
              variant="outlined"
              className="text-emerald-500 w-[100%] outline-amber-400"
              {...register("username", { required: true })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      className="outline-amber-400"
                      sx={{
                        opacity: 0,
                        pointerEvents: 'none',
                        [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: {
                          opacity: 1,
                        },
                      }}
                    >
                    </InputAdornment>
                  ),
                },
              }}
            />
            <FormControl variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                {...register("password", { required: true })}
                className="text-emerald-500 outline-amber-400"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? 'hide the password' : 'display the password'
                      }
                      onClick={() => setShowPassword((show) => !show)}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <button
              type="submit"
              className="w-[100%] p-[10px] bg-amber-400 text-white rounded-[10px] font-black cursor-pointer hover:bg-emerald-400"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login