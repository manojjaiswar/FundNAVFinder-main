import {Route, Redirect} from 'react-router-dom'
 
const PrivateRoute = ({Component, isAuth, exact, path, childProps, ...rest}) =>{
  return(
    <Route
      exact={exact}
      path={path}
      render={({location})=>{
        if(isAuth){
          return <Component isAuth={isAuth} {...childProps} {...rest} />
        } else {
          return <Redirect to={{pathname:'/login', state:{from:location}}} /> 
        }
      }}
    />
  );
}

export default PrivateRoute;