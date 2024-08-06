import { useEffect, useState } from 'react';
import useShowToast from './useShowToast';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from "@apollo/client";
import { GetProfileByName } from "../apollo/queries.js";

const GET_PROFILE_BY_NAME = gql`
  ${GetProfileByName}
`;

const getUserProfile = (usernameFromProps) => {
  const { username: usernameFromParams } = useParams();
  const username = usernameFromProps || usernameFromParams;

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowToast();

  const { loading, error, data, refetch } = useQuery(GET_PROFILE_BY_NAME, {
    variables: { username },
    skip: !username, // Skip the query if username is not provided
    onCompleted: (result) => {
      console.log('getProfileName result: ', result);
      if (result?.getProfileByName?.isFrozen) {
        setUser(null);
        return;
      }
      setUser(result?.getProfileByName);
      setIsLoading(false);
    },
    onError: (error) => {
      console.log('getUserProfileName error : ', error);
      showToast('Error', error.message, 'error');
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data) {
      setUser(data.getProfileByName);
    }
    setIsLoading(loading);
  }, [data, loading]);

  return { user, isLoading, error, refetch };
};

export default getUserProfile;
