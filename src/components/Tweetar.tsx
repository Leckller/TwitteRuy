import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../firebase';
import { GlobalState } from '../types';
import RandomIdFunction from '../utils/RandomIdFunction';
import { TweetDivBody, TweetDivForm,
  TweetDivHeader, TweetDivText } from '../Styles/TweetStyles';

/* eslint-disable jsx-a11y/label-has-associated-control */
function Tweetar({ setClose, close }: {
  close: boolean, setClose: (p: boolean) => void }) {
  const { user } = useSelector((state:GlobalState) => state.UserReducer);
  const [SubmitForm, setSubmitForm] = useState<{ text: string, arquivo: File }>(
    { arquivo: {} as File, text: '' },
  );

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>
  | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // Envio Tweet sem foto
    const idPost = RandomIdFunction();
    const data = new Date();
    const dataRef = [data.toDateString().split(' '), data.toLocaleTimeString()];
    await setDoc(doc(db, 'Posts', idPost), {
      imageUrl: '',
      userId: user.uid,
      altImg: '',
      text: SubmitForm.text,
      userName: user.displayName,
      postId: idPost,
      data: JSON.stringify(dataRef),
      userImg: user.photoURL,
      likes: [],
      edit: false,
    });
    // método para adicionar sem especificar o nome do objeto
    //   addDoc(collection(db, 'Posts'), {
    //     imageUrl: '',
    //     userId: user.uid,
    //     altImg: '',
    //     text: SubmitForm.text,
    //     userName: user.displayName,
    //     postId: RandomIdFunction(),
    //     data,
    //     userImg: user.photoURL,
    //     likes: [],
    //   });
    setSubmitForm({
      arquivo: {} as File,
      text: '',
    });
    setClose(!close);
  };
  if (window.innerWidth <= 550) {
    return (
      <TweetDivBody>
        <TweetDivHeader>
          <button onClick={ () => setClose(!close) }>X</button>
          <button onClick={ (e) => handleOnSubmit(e) } type="submit">Postar</button>
        </TweetDivHeader>
        <TweetDivText>
          <label htmlFor="textAreaTweet">
            <textarea
              placeholder="O que está acontecendo?"
              maxLength={ 350 }
              name="Tweet"
              id="textAreaTweet"
              rows={ 20 }
              onChange={ (e) => setSubmitForm({ ...SubmitForm, text: e.target.value }) }
            />
          </label>
        </TweetDivText>
        <TweetDivForm>
          <form onSubmit={ (e) => handleOnSubmit(e) }>
            <label htmlFor="arquivo">
              Image
              <input id="arquivo" type="file" />
            </label>
          </form>
        </TweetDivForm>
      </TweetDivBody>
    );
  }
  return (
    <TweetDivBody>
      <div>
        <button onClick={ () => setClose(!close) }>X</button>
      </div>
      <div>
        <label htmlFor="textAreaTweet">
          <textarea
            maxLength={ 350 }
            name="Tweet"
            id="textAreaTweet"
            onChange={ (e) => setSubmitForm({ ...SubmitForm, text: e.target.value }) }
          />
        </label>
      </div>
      <form onSubmit={ handleOnSubmit }>
        <div>
          <label htmlFor="arquivo">
            Image
            <input id="arquivo" type="file" />
          </label>
        </div>
        <div>
          <button type="submit">Postar</button>
        </div>
      </form>
    </TweetDivBody>
  );
}

export default Tweetar;
