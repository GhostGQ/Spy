import { router } from 'expo-router';
import { X } from 'phosphor-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { ScreenGradient } from '@/components/ScreenGradient';
import { colors } from '@/theme/colors';

// TODO(production): заполнить реальными реквизитами перед релизом.
const APP_NAME = 'Шпион';
const DEVELOPER = '[Название разработчика]';
const CONTACT_EMAIL = '[email@example.com]';
const EFFECTIVE_DATE = '[дата]';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-3">
      <Text className="mb-2 font-sans-b text-lg text-white">{title}</Text>
      {children}
    </Card>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <Text className="font-sans text-sm leading-6 text-text-secondary">{children}</Text>;
}

export default function Privacy() {
  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-row items-center px-3 pb-2 pt-4">
          <Text className="flex-1 font-display text-2xl uppercase text-white">
            Политика конфиденциальности
          </Text>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={{ backgroundColor: colors.surface, borderColor: colors.borderSubtle }}
            className="h-11 w-11 items-center justify-center rounded-full border active:opacity-80"
          >
            <X size={22} color={colors.textSecondary} weight="bold" />
          </Pressable>
        </View>

        <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 32 }}>
          <Text className="mb-4 px-1 font-sans text-xs text-muted">
            Настоящая Политика конфиденциальности описывает, как мобильное приложение «{APP_NAME}»
            (далее — «Приложение»), разработанное {DEVELOPER} (далее — «Разработчик»), обращается с
            данными пользователей.
          </Text>

          <Section title="1. Общие положения">
            <Body>
              Мы уважаем вашу конфиденциальность. Настоящая Политика объясняет, какие данные
              используются Приложением и как они хранятся. Используя Приложение, вы соглашаетесь с
              условиями данной Политики.
            </Body>
          </Section>

          <Section title="2. Какие данные мы собираем">
            <Body>
              Приложение не собирает и не запрашивает персональные данные. Для использования
              «{APP_NAME}» не требуется регистрация, учётная запись, адрес электронной почты или
              доступ к вашим контактам, геолокации, камере либо микрофону.
            </Body>
          </Section>

          <Section title="3. Локальное хранение данных">
            <Body>
              Приложение сохраняет только пользовательские настройки (например, звук и вибрация) и
              последние выбранные категории игры. Эти данные хранятся исключительно локально на
              вашем устройстве и не покидают его, не передаются Разработчику или третьим лицам.
            </Body>
          </Section>

          <Section title="4. Передача данных третьим лицам">
            <Body>
              Мы не передаём какие-либо данные третьим лицам. Приложение не использует серверы,
              системы аналитики, рекламные сети или сторонние SDK для сбора данных.
            </Body>
          </Section>

          <Section title="5. Разрешения устройства">
            <Body>
              Приложение использует только функцию тактильной отдачи (вибрацию) для откликов
              интерфейса, и её можно отключить в настройках. Доступ к камере, микрофону,
              геолокации, контактам и другим чувствительным данным не запрашивается.
            </Body>
          </Section>

          <Section title="6. Дети">
            <Body>
              Приложение подходит для семейного использования. Поскольку персональные данные не
              собираются, использование Приложения не предполагает обработки информации о детях.
            </Body>
          </Section>

          <Section title="7. Удаление данных">
            <Body>
              Все сохранённые настройки хранятся локально. Удаление Приложения с устройства
              автоматически и безвозвратно стирает все связанные с ним локальные данные.
            </Body>
          </Section>

          <Section title="8. Изменения политики">
            <Body>
              Разработчик может время от времени обновлять настоящую Политику. Актуальная редакция
              всегда доступна в Приложении. Продолжая использовать Приложение, вы соглашаетесь с
              обновлённой Политикой.
            </Body>
          </Section>

          <Section title="9. Контакты">
            <Body>
              По любым вопросам, связанным с настоящей Политикой конфиденциальности, вы можете
              связаться с Разработчиком по адресу: {CONTACT_EMAIL}.
            </Body>
          </Section>

          <Text className="mt-2 px-1 font-sans text-xs text-muted">
            Дата вступления в силу: {EFFECTIVE_DATE}.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </ScreenGradient>
  );
}
