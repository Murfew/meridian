import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "react-email";

interface ExistingAccountEmailProps {
  signInUrl: string;
  resetPasswordUrl: string;
}

export function ExistingAccountEmail({
  signInUrl,
  resetPasswordUrl,
}: ExistingAccountEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Someone tried to sign up with your email</Preview>

      <Tailwind
        config={{
          theme: {
            extend: {
              colors: { brand: "#4f39f6" },
              fontFamily: {
                sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
              },
            },
          },
        }}
      >
        <Body className="bg-gray-50 font-sans py-12">
          <Container className="mx-auto max-w-xl rounded-[0.875rem] border border-solid border-gray-200 bg-white px-8 py-10">
            <Text className="m-0 text-lg font-bold tracking-tight text-gray-900">
              Meridian
            </Text>

            <Heading className="mt-8 mb-0 text-3xl font-bold text-gray-900">
              You already have an account
            </Heading>

            <Text className="mt-3 text-base leading-6 text-gray-700">
              Someone just tried to sign up for Meridian using this email
              address, but an account already exists. If this was you, sign in
              below instead.
            </Text>

            <Button
              href={signInUrl}
              className="mt-6 box-border inline-block rounded-[0.625rem] bg-brand px-6 py-3 font-medium text-white"
            >
              Sign in
            </Button>

            <Hr className="my-8 border-gray-200" />

            <Text className="mb-1 text-sm text-gray-700">
              Forgot your password?
            </Text>
            <Text className="mb-6 break-all text-xs text-gray-500">
              {resetPasswordUrl}
            </Text>

            <Text className="m-0 text-sm text-gray-500">
              If this wasn&apos;t you, you can safely ignore this email.
            </Text>
          </Container>

          <Text className="mt-6 text-center text-xs text-gray-500">
            Meridian
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
}

ExistingAccountEmail.PreviewProps = {
  signInUrl: "https://example.com/sign-in",
  resetPasswordUrl: "https://example.com/forgot-password",
} satisfies ExistingAccountEmailProps;

export default ExistingAccountEmail;
