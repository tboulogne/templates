import {
  Box,
  Button,
  Flex,
  Select,
  Stack,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import Form from "@rjsf/chakra-ui";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import templates from "../templates";

const Home: NextPage = () => {
  const [slug, setSlug] = useState<string>("");
  const [formData, setFormData] = useState<any>();
  const [output, setOutput] = useState<string>("");
  const { hasCopied, onCopy } = useClipboard(output);
  const selected = templates.find((item) => item.slug === slug);
  const template = selected ? selected.template : null;

  useEffect(() => {
    setFormData(null);
    setOutput("");
  }, [slug]);

  return (
    <Box
      display={{ lg: "grid" }}
      gridTemplateRows="auto 1fr"
      gridTemplateColumns="400px 1fr"
      height={{ lg: "100vh" }}
      bg="gray.800"
    >
      <Box
        shadow="md"
        zIndex="100"
        gridRow="1 / 2"
        gridColumn="1 / 3"
        px="4"
        py="2"
        bg="white"
      >
        <Flex direction="row" alignItems="center">
          <Text fontWeight="bold" fontSize="lg" mr="6">
            Templates
          </Text>
          <Select
            width="64"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value as any);
            }}
          >
            <option value="">Select Template</option>
            {templates.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.template.name}
              </option>
            ))}
          </Select>
        </Flex>
      </Box>
      {template && (
        <Box
          gridRow="2 / 3"
          gridColumn="1 / 2"
          overflow="auto"
          p="4"
          bg="white"
        >
          <Form
            schema={template.schema as any}
            formData={formData}
            onChange={(event) => setFormData(event.formData)}
            onSubmit={({ formData }) => {
              try {
                const output = template.generate(formData);
                setOutput(JSON.stringify(output, null, 2));
              } catch (error) {
                setOutput(`Error: ${(error as Error).message}`);
              }
            }}
            noHtml5Validate
            showErrorList={false}
            validate={template.validate}
            transformErrors={template.transformErrors}
          >
            <Button type="submit" colorScheme="brand">
              Generate
            </Button>
          </Form>
        </Box>
      )}
      <Box gridRow="2 / 3" gridColumn="2 / 3" overflow="auto" p="4">
        {output && (
          <Stack alignItems="start">
            <Button onClick={onCopy}>{hasCopied ? "Copied" : "Copy"}</Button>
            <Box as="pre" overflow="auto" w="100%" color="white">
              {output}
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default Home;
