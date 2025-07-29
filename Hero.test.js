import { render, screen } from '@testing-library/react';
import Hero from './Hero'; // Замени на путь к твоему компоненту

test('renders title correctly', () => {
  render(<Hero />);
  const titleElement = screen.getByText(/Открой революцию в веб-дизайне/i);
  expect(titleElement).toBeInTheDocument();
});

test('AI button triggers alert', () => {
  window.alert = jest.fn(); // Мокируем alert
  render(<Hero />);
  const button = screen.getByText(/Поговори с AI-ассистентом/i);
  button.click();
  expect(window.alert).toHaveBeenCalledWith('Привет! Я AI-гид. Хочешь узнать о примерах работ? Спроси о "Свой дом НН"!');
});
