import { Action } from "@colonydb/anthill/Action";
import { Button } from "@colonydb/anthill/Button";
import { Card } from "@colonydb/anthill/Card";
import { CardContent } from "@colonydb/anthill/CardContent";
import { Form } from "@colonydb/anthill/Form";
import { FormFooter } from "@colonydb/anthill/FormFooter";
import { Header } from "@colonydb/anthill/Header";
import { Heading } from "@colonydb/anthill/Heading";
import { Icon } from "@colonydb/anthill/Icon";
import { MultiColumnStack } from "@colonydb/anthill/MultiColumnStack";
import { PlainText } from "@colonydb/anthill/PlainText";
import { RegularField } from "@colonydb/anthill/RegularField";
import { Section } from "@colonydb/anthill/Section";
import { Specimen } from "@colonydb/anthill/Specimen";
import { StringInput } from "@colonydb/anthill/StringInput";
import { useForm } from "@colonydb/anthill/useForm";
import * as v from "valibot";
import type { ListConfig } from ".";
import List from "./List";

type Props = {
  id: string;
  list: ListConfig;
  onCancel: () => void;
  onSubmit: (list: ListConfig) => void;
  onSuccess: () => void;
  title: string;
};

const schema = v.object({
  exclude: v.optional(v.string()),
  id: v.string(),
  include: v.optional(v.string()),
  itemSelector: v.pipe(v.string(), v.nonEmpty()),
  linkSelector: v.optional(v.string()),
  name: v.pipe(v.string(), v.nonEmpty()),
  titleSelector: v.optional(v.string()),
  url: v.pipe(v.string(), v.nonEmpty(), v.url()),
});

const ListForm = ({ id, list: initialList, onCancel, onSubmit, onSuccess, title }: Props) => (
  <Form
    action={async ({ data }) => {
      onSubmit(data);
      return {
        data,
        ok: true,
      };
    }}
    onSuccess={onSuccess}
    id={id}
    initialData={initialList}
    schema={schema}
  >
    <Card
      header={
        <Header
          actions={
            <Action
              fontSize="heading"
              icon={<Icon symbol="Remove" />}
              title="close"
              onClick={() => {
                onCancel();
              }}
            />
          }
        >
          <Heading>{title}</Heading>
        </Header>
      }
      footer={
        <FormFooter
          actionLabel="Save"
          secondaryAction={
            <Button
              onClick={() => {
                onCancel();
              }}
            >
              Cancel
            </Button>
          }
        />
      }
    >
      <CardContent>
        <MultiColumnStack columns="30ch">
          <Section title={<Heading>Configuration</Heading>}>
            <RegularField label="Name" name="name" required>
              <StringInput name="name" placeholder="Reddit" />
            </RegularField>
            <RegularField label="URL" name="url" required>
              <StringInput name="url" placeholder="https://www.reddit.com/" />
            </RegularField>
            <RegularField label="Item Selector" name="itemSelector" required>
              <StringInput name="itemSelector" placeholder="article" />
            </RegularField>
            <RegularField label="Title Selector" name="titleSelector">
              <StringInput name="titleSelector" placeholder="a" />
            </RegularField>
            <RegularField label="Link Selector" name="linkSelector">
              <StringInput name="linkSelector" placeholder="a" />
            </RegularField>
            <RegularField label="Include" name="include">
              <StringInput name="include" placeholder="example, example two" />
            </RegularField>
            <RegularField label="Exclude" name="exclude">
              <StringInput name="exclude" placeholder="example, example two" />
            </RegularField>
          </Section>
          <Preview />
        </MultiColumnStack>
      </CardContent>
    </Card>
  </Form>
);

const Preview = () => {
  const { data } = useForm(schema);
  return (
    <Section title={<Heading>Preview</Heading>}>
      <Specimen>
        {v.is(schema, data) ? (
          <List
            exclude={data.exclude}
            include={data.include}
            itemSelector={data.itemSelector}
            linkSelector={data.linkSelector}
            name={data.name}
            titleSelector={data.titleSelector}
            url={data.url}
          />
        ) : (
          <PlainText font="regular-italic" color={["gray-t1", "gray-s1"]}>
            Not configured
          </PlainText>
        )}
      </Specimen>
    </Section>
  );
};

export default ListForm;
