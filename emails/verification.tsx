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
} from "@react-email/components";

interface VerificationEmailProps {
  verificationUrl: string;
  expiresIn?: string;
}

export function VerificationEmail({
  verificationUrl,
  expiresIn = "24 hours",
}: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Verify your email address</Preview>

      <Tailwind
        config={{
          theme: { extend: { colors: { brand: "#4c6ef5" } } },
        }}
      >
        <Body className="bg-gray-50 font-sans py-12">
          <Container className="mx-auto max-w-xl rounded-xl border border-solid border-gray-200 bg-white px-8 py-10">
            <Text className="m-0 text-lg font-bold tracking-tight text-gray-900">
              Meridian
            </Text>

            <Heading className="mt-8 mb-0 text-3xl font-bold text-gray-900">
              Verify your email
            </Heading>

            <Text className="mt-3 text-base leading-6 text-gray-700">
              Click the button below to verify your email address and
              complete your account setup.
            </Text>

            <Button
              href={verificationUrl}
              className="mt-6 box-border inline-block rounded-md bg-brand px-6 py-3 font-medium text-white"
            >
              Verify email address
            </Button>

            <Text className="mt-4 text-sm text-gray-500">
              This link will expire in {expiresIn}.
            </Text>

            <Hr className="my-8 border-gray-200" />

            <Text className="mb-1 text-xs text-gray-500">
              If the button doesn&apos;t work, copy and paste this URL into
              your browser:
            </Text>
            <Text className="mb-6 break-all text-xs text-gray-500">
              {verificationUrl}
            </Text>

            <Text className="m-0 text-sm text-gray-500">
              If you didn&apos;t create an account, you can safely ignore
              this email.
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

VerificationEmail.PreviewProps = {
  verificationUrl: "https://example.com/verify?token=abc123xyz",
  expiresIn: "24 hours",
} satisfies VerificationEmailProps;

export default VerificationEmail;
