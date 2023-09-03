import { useEffect, useState } from 'react';
import { fetchTopics } from '@/utils/fetchData';
import { deauthenticate } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';
import { GetTopicsParamsResponse } from '@/types/api';
import ButtonUI from '@/components/UI/ButtonUI';

const Home = () => {
  const [topics, setTopics] = useState<GetTopicsParamsResponse['topics']>({});
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { result } = await fetchTopics();

        setTopics(result.topics);
      } catch (err) {
        console.log('Wrong authentication data');
        deauthenticate();
        navigate('/login');
      }
    })();
  }, [])

  const openTopic = (id: string) => {
    navigate(`/${ id }`);
  }

  return (
    <div>
      <h1>Topics</h1>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {Object.keys(topics).length && Object.keys(topics).map(id => (
          <ButtonUI
            key={id}
            onClick={() => openTopic(id)}
            style={{margin: '10px 0', maxWidth: '300px'}}
          >
            {topics[id]}
          </ButtonUI>
        ))}
      </div>
    </div>
  );
};

export default Home;
