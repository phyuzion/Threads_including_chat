import { useLazyQuery, gql } from '@apollo/client';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import postsAtom from '../atoms/postsAtom';
import { GetPostsByHashtag } from '../apollo/queries';

const GET_POSTS_BY_HASHTAG = gql`
  ${GetPostsByHashtag}
`;

function useHashtagSearch() {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();
  const [handleHashtagClick, { loading, error, data }] = useLazyQuery(GET_POSTS_BY_HASHTAG, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.getPostsByHashTag) {
        setPosts(data.getPostsByHashTag);
        navigate('/');
      }
    },
    onError: (error) => {
      console.error('getPostsByHashTag error:', error);
    },
  });

  const searchHashtag = (hashtag) => {
    handleHashtagClick({ variables: { hashtag, skip: 0, limit: 10 } });
  };

  return { searchHashtag, loading, error, data };
}

export default useHashtagSearch;
