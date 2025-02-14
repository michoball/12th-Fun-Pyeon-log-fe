import styled from 'styled-components'

export const Wrapper = styled.article`
  display: flex;
  flex-direction: row;
  overflow-y: hidden;

  @media screen and (max-width: 576px) {
    flex-direction: column;
  }
`
export const MapWrap = styled.section`
  position: relative;
  width: 100%;

  .map {
    width: 100%;
    height: calc(100vh - 80px);
  }

  @media screen and (max-width: 576px) {
    .map {
      height: calc(65vh - 60px);
    }
  }
`

export const ListView = styled.section`
  background-color: white;
  position: relative;
  z-index: 3;
  width: 25vw;
  min-width: 250px;
  max-width: 300px;
  height: calc(100vh - 80px);
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);

  @media screen and (max-width: 768px) {
    width: 40vw;
    min-width: 200px;
    max-width: 250px;
  }

  @media screen and (max-width: 576px) {
    order: 2;
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    height: calc(40vh + 30px);
  }
`
export const ListTop = styled.div`
  height: 90px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  padding: 10px;

  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 576px) {
    height: 50px;
  }
`
export const SearchBox = styled.form`
  margin-right: 10px;
  width: 15vw;
  min-width: 170px;
  height: 30px;

  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 5px;
  padding: 5px 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  input {
    min-width: 120px;
    padding: 0 10px;
    border: none;
    outline: none;
  }

  button {
    width: 30px;
    height: 30px;
    color: ${(props) => props.theme.colors.searchBtn};
    background-color: transparent;
    border: none;
    text-align: right;
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    width: 80%;
    min-width: 145px;
    margin-right: 5px;

    input {
      min-width: 120px;
      padding-right: 0;
      font-size: 13px;
    }
    button {
      padding-left: 0px;
    }
  }
`
export const SortBtn = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 5px;
  background-color: transparent;
  color: ${(props) => props.theme.colors.searchBtn};
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  &.on {
    background-color: #efefef;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`
