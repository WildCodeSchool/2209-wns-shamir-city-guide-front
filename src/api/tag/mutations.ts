import { gql } from "@apollo/client";


export const CREATE_TAG = gql`
  mutation CreateTag ($tag: TagType!) {
    createTag(tag: $tag) {
      id
      name
      icon
    }
  }
`;

export const UPDATE_TAG = gql`
  mutation UpdateTag ($tag: TagType!) {
    updateTag(tag: $tag) {
      id 
      name
      icon
    }
  }
`;

export const DELETE_TAG = gql`
  mutation DeleteTag ($deleteTagId: Float!) {
    deleteTag (id: $deleteTagId) {
      name  
      icon 
    }
  }
`;
