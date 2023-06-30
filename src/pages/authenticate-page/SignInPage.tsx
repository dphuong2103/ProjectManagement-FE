import { Button, TextField } from '@mui/material'
import PageTitle from '../../components/PageTitle'
import styles from '../../styles/AuthenticatePage.module.scss'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { routeName } from '../../constant/routes';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../../utilities/auth';
import { IUser } from '../../data-types/DataType';
import { useAuthContext, useSpinnerContext } from '../../constant/context-value';

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setIsLoading} = useSpinnerContext();
  const { setCurrentUser } = useAuthContext();


  async function handleSignUserIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      const currentUser = getCurrentUser();
      if (currentUser != null) {
        const signedInUser: IUser = {
          id: currentUser.uid,
          displayName: currentUser.displayName ?? '',
          email: email,
          photoURL: currentUser.photoURL ?? '',
          accessToken: await currentUser.getIdToken()
        };
        setCurrentUser(signedInUser);
      }
    }
    catch (err) {
      toast.error('Invalid email or password');
      console.log('Error logging in' + err);
    }finally{
      setIsLoading(false);
    }
  }

  return (
    <>
      <PageTitle>Sign In</PageTitle>
      <form onSubmit={handleSignUserIn}>
        <div className={`${styles['sign-in-content-container']} ${styles['content-container']}`}>
          <TextField id="outlined-basic" type='email' label="Email" variant="outlined" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
          <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth type='password' value={password} onChange={e => setPassword(e.target.value)} />
          <div className={styles['form-action']}>
            <a className={styles['forgot-password-button']}>Forgot your password?</a>
            <Button variant="outlined" type='submit'>Log in</Button>
          </div>
        </div>
      </form>
      <div className={styles['sign-up__container']}>
        <span>Don't have an account?</span>
        <Link to={routeName.signUp}> Sign up</Link>
      </div>
    </>
  )
}

export default SignInPage