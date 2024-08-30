import styled from "styled-components";
import Modal from "react-modal";
import { border } from "./styles";
import closeGame from '../../assets/Images/close xo.png'
import startOver from '../../assets/Images/start xo.png'
import pirate from '../../assets/Images/pirateHat.png'
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0, 0.6)",
  },
};

interface Props {
  isOpen: boolean;
  close: () => void;
  startNewGame: () => void;
  winner: null | string;
}
export const ResultModal = ({ isOpen, close, startNewGame, winner }: Props) => {
  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={close}
      style={customStyles}
      ariaHideApp={false}
    >
      <ModalWrapper className="font-newrocker bg-slate-300">
        <ModalTitle>Game over</ModalTitle>
        <img src={pirate} alt="pirate" className="w-40"/>
        <ModalContent className="text-green-700 text-3xl">{winner}</ModalContent>

        <ModalFooter>
          <img src={closeGame} alt="close" onClick={close} className="w-16 cursor-pointer"/>
          <img src={startOver} alt="start over" onClick={startNewGame} className="w-24 h-18 cursor-pointer"/>
          {/* <Button onClick={close}>Close</Button>
          <Button onClick={startNewGame}>Start over</Button> */}
        </ModalFooter>
      </ModalWrapper>
    </StyledModal>
  );
};

// Styling Components
const StyledModal = styled(Modal)`
  height: 300px;
  position: relative;
  margin: 0 auto;
  top: 10%;
  right: auto;
  bottom: auto;
  width: 320px;
  outline: none;
  display: flex;
  flex-direction: column;
`;
const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  // background-color: #fff;
  max-height: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  backface-visibility: hidden;
  padding: 1.25rem;
  ${border};
`;

const ModalTitle = styled.p`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
`;

const ModalContent = styled.p`
  // flex: 1 1 auto;
  text-align: center;
`;
ModalContent.displayName = "ModalContent";

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 0 0 auto;
  width: 100%;
`;

// const Button = styled.button`
//   font-size: 16px;
// `;