import { styled } from "react-tailwind-variants";

export default function Popup() {

  return (
    <Container>
      <Icon src="/icon-with-shadow.svg" />
      <Title>vite-plugin-web-extension</Title>
      <Description>
        Template: <code>react-ts</code>
      </Description>
    </Container>
  );
}

const Container = styled("div", {
  base: "flex flex-col items-center justify-center h-screen",
});

const Icon = styled("img", {
  base: "w-20 h-20",
});

const Title = styled("h1", {
  base: "text-3xl text-blue-500",
});

const Description = styled("p", {
  base: "text-gray-500",
});
