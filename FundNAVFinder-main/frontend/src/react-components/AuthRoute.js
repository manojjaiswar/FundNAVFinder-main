import {Route, Redirect} from 'react-router-dom'

const AuthRoute = ({Component, isAuth, exact, path, childProps, ...rest}) =>{
  return(
    <Route
      exact={exact}
      path={path}
      render={({location:{state}})=>{
        if(isAuth){
          return <Redirect to= {state?.from.pathname ? state.from.pathname : '/'} /> 
        } else {
          return <Component  {...childProps} {...rest} />
        }
      }}
    />
  );
}

export default AuthRoute;