import TextField from '@mui/material/TextField'
import PageTitle from '../../components/PageTitle'
import styles from '../../styles/AuthenticatePage.module.scss'
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { routeName } from '../../constant/routes';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase-config';
import { toast } from 'react-toastify';
import { IUser } from '../../data-types/DataType';
import { updateUserProfile } from '../../utilities/fetchData';
import { getCurrentUser } from '../../utilities/auth';
import { useAuthContext, useSpinnerContext } from '../../constant/context-value';
function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { setIsLoading } = useSpinnerContext();
  const { setCurrentUser } = useAuthContext();
  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validateUser()) {
      try {
        setIsLoading(true);
        await createUserWithEmailAndPassword(auth, email, password);
        const currentUser = getCurrentUser();
        if (currentUser != null) {
          const signedUpUser: IUser = {
            id: currentUser.uid,
            displayName: fullName,
            email: email,
            photoURL: currentUser.photoURL ?? '',
            accessToken: await currentUser.getIdToken(),
          };
          await updateUserProfile(signedUpUser);
          setCurrentUser(signedUpUser)
          toast.success('Signed up successfully');
        }
      } catch (err) {
        toast.error('Error signing up! PLease try again');
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
  }

  function validateUser(): boolean {
    if (fullName == '') {
      toast.error('Please enter full name');
      return false;
    }
    else if (password != confirmPassword) {
      toast.error('Confirm password not match');
      return false;
    }
    else if (password == '') {
      toast.error('Please enter password');
      return false;
    }
    else if (confirmPassword == '') {
      toast.error('Please enter confirm password');
      return false;
    }
    else { return true; }
  }

  return (
    <>
      <PageTitle>Sign Up</PageTitle>
      <form onSubmit={handleSignUp}>
        <div className={styles['content-container']}>
          <TextField id="outlined-basic" required type='email' label="Email" variant="outlined" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
          <TextField id="outlined-basic" required label="Full Name" variant="outlined" fullWidth value={fullName} onChange={e => setFullName(e.target.value)} />
          <TextField id="outlined-basic" required label="Password" variant="outlined" fullWidth type='password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          <TextField id="outlined-basic" required label="Confirm Password" variant="outlined" fullWidth type='password' value={password} onChange={e => setPassword(e.target.value)} />
          <div className={`${styles['form-action']} ${styles['signup']}`}>
            <Button variant="outlined" type='submit'>Sign up</Button>
          </div>
        </div>
      </form>
      <div className={styles['sign-in__container']} >
        <span>Already have an account? </span>
        <Link to={routeName.signIn}>Sign in</Link>
      </div>
    </>
  )
}

export default SignUpPage