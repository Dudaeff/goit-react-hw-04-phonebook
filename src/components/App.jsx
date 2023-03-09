import { nanoid } from "nanoid";
import { useState, useEffect } from "react";
import { getFromLocal, saveToLocal } from "services/Storage/Storage";
import { ContactForm } from "./ContactForm/ContactForm";
import { ContactList } from "./ContactList/ContactList";
import { Filter } from "./Filter/Filter";
import { Section } from "./Section/Section";

export const App = () => {
  const [contacts, setContacts] = useState(() => getFromLocal('contacts') || []);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    saveToLocal('contacts', contacts)
  }, [contacts]);
  

  const onContactFormSubmit = (evt) => {
    evt.preventDefault();
    const { name, number } = evt.target.elements;

    const inContacts = contacts.find(contact => contact.name.toLocaleLowerCase() === name.value.toLocaleLowerCase());

    if (inContacts) {
      alert(`${inContacts.name} is already in contacts`)
      return
    }

    setContacts(prev => [...prev, {
      id: nanoid(),
      name: name.value,
      number: number.value,
    }]);
  };

  const onDeleteBtnClick = id => {
    const updatedContacts = contacts.filter(contact => id !== contact.id);

    setContacts([...updatedContacts]);
  };

  const filterContacts = (evt) => setFilter(evt.target.value);
  const findContact = (contactName) => contacts.filter(({ name }) => name.toLowerCase().includes(contactName.toLowerCase()));

  return (
    <div>
      <Section title={'Phonebook'}>
        <ContactForm onSubmit={onContactFormSubmit} />

        <h2>Contacts</h2>
        <Filter onChange={filterContacts} />
        <ContactList contacts={filter ? findContact(filter) : contacts} onClick={onDeleteBtnClick} />
      </Section>
    </div>
  );
};