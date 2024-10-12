import { styled } from "react-tailwind-variants";
import { acceptRequest } from "./send-message";

export default function Prompt() {
  return (
    <Container>
      <button
        onClick={() => {
          acceptRequest("fedimint", "getVersion", {});
        }}
      >
        Click
      </button>
    </Container>
  );
}

const Container = styled("div", {
  base: "flex flex-col items-center justify-center h-screen",
});
