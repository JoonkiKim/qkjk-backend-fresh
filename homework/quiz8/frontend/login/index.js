window.OpenModal = () => {
  let ModalBackground = document.getElementById("ModalContainer");
  let Modal = document.getElementById("SignupModalWrapper");
  ModalBackground.style.display = "flex";
  Modal.style.display = "flex";
};
window.CloseModal = () => {
  let ModalBackground = document.getElementById("ModalContainer");
  let Modal = document.getElementById("SignupModalWrapper");
  Modal.style.display = "none";
  ModalBackground.style.display = "none";
};
