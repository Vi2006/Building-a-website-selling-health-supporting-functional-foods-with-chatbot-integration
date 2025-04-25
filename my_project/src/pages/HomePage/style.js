import styled from "styled-components";

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-start;
  border-bottom: 1px solid red;
  padding: 14px 0;
  width: 100%;
  box-sizing: border-box;
`;

export const WrapperProducts = styled.div`
  margin: 0 auto;
  .grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 768px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .grid {
      grid-template-columns: repeat(5, 1fr);
    }
  }
`;
