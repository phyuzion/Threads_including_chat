import { useEffect, useState } from 'react';
import useShowToast from './useShowToast';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from "@apollo/client";
import { GetProfileByName } from "../apollo/queries.js";

const GET_PROFILE_BY_NAME = gql`
  ${GetProfileByName}
`;

const getUserProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { username } = useParams();
  

  //console.log(' getProfileName username: ',username)
  const { loading , error , data }=  useQuery(GET_PROFILE_BY_NAME,{
    variables: {username},
    onCompleted: (result) => {
      console.log('getProfileName result: ',result)
      if (result?.getProfileByName?.isFrozen) {
        setUser(null);
        return;
      }
      setUser(result?.getProfileByName);
      setIsLoading(false);
    },
    onError: (error) => {
      console.log('getUserProfileName error : ',error,' post: ',post)
    },
    fetchPolicy: "network-only",
  })
  console.log('getUserProfile loading: ',loading)

    //setIsLoading(true)


  if(error) {
    console.log('getUserProfile error : ',error)
   
  }

 
  console.log(' getUserProfile user: ',user , ' isLoading : ',isLoading)
  return { user, isLoading };
};

export default getUserProfile;
