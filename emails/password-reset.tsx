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

interface PasswordResetEmailProps {
  resetUrl: string;
  expiresIn?: string;
}

export function PasswordResetEmail({
  resetUrl,
  expiresIn = "1 hour",
}: PasswordResetEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Reset your password</Preview>

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
              Reset your password
            </Heading>

            <Text className="mt-3 text-base leading-6 text-gray-700">
              We received a request to reset the password for your account.
              Click the button below to choose a new one.
            </Text>

            <Button
              href={resetUrl}
              className="mt-6 box-border inline-block rounded-md bg-brand px-6 py-3 font-medium text-white"
            >
              Reset password
            </Button>

            <Text className="mt-4 text-sm text-gray-500">
              This link will expire in {expiresIn}.
            </Text>

            <Hr className="my-8 border-gray-200" />

            <Text className="mb-1 text-xs text-gray-500">
              If the button doesn&apos;t work, copy and paste this URL into your
              browser:
            </Text>
            <Text className="mb-6 break-all text-xs text-gray-500">
              {resetUrl}
            </Text>

            <div className="rounded-md border border-solid border-amber-200 bg-amber-50 p-4">
              <Text className="m-0 text-sm text-amber-900">
                <strong>Didn&apos;t request this?</strong> You can safely ignore
                this email — your password will remain unchanged. Never share
                this link with anyone; Meridian will never ask for your
                password.
              </Text>
            </div>
          </Container>

          <Text className="mt-6 text-center text-xs text-gray-500">
            Meridian
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
}

PasswordResetEmail.PreviewProps = {
  resetUrl: "https://example.com/reset-password?token=abc123xyz",
  expiresIn: "1 hour",
} satisfies PasswordResetEmailProps;

export default PasswordResetEmail;
