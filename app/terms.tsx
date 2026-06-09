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
const JURISDICTION = '[страна/регион]';
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

export default function Terms() {
  return (
    <ScreenGradient>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-row items-center px-3 pb-2 pt-4">
          <Text className="flex-1 font-display text-2xl uppercase text-white">
            Условия использования
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
            Настоящие Условия использования регулируют порядок использования мобильного приложения
            «{APP_NAME}» (далее — «Приложение»), правообладателем которого является {DEVELOPER}{' '}
            (далее — «Разработчик»).
          </Text>

          <Section title="1. Принятие условий">
            <Body>
              Устанавливая, открывая или используя Приложение, вы подтверждаете, что прочитали,
              поняли и согласны соблюдать настоящие Условия. Если вы не согласны с каким-либо
              положением, пожалуйста, не используйте Приложение.
            </Body>
          </Section>

          <Section title="2. Описание сервиса">
            <Body>
              «{APP_NAME}» — это локальная офлайн-игра для компании. Игроки передают одно устройство
              по кругу, по очереди просматривают свою роль и слово, после чего обсуждают и пытаются
              вычислить шпиона. Приложение работает полностью на устройстве и не требует подключения
              к интернету, регистрации или создания учётной записи.
            </Body>
          </Section>

          <Section title="3. Лицензия на использование">
            <Body>
              Разработчик предоставляет вам ограниченную, личную, неисключительную, отзывную и
              непередаваемую лицензию на использование Приложения для личных некоммерческих целей.
              Запрещается продавать, сдавать в аренду, распространять или иным образом передавать
              Приложение третьим лицам.
            </Body>
          </Section>

          <Section title="4. Интеллектуальная собственность">
            <Body>
              Приложение, его название, исходный код, дизайн, графика, тексты заданий и иные
              материалы являются интеллектуальной собственностью Разработчика и защищены
              применимым законодательством. Все права, прямо не предоставленные вам, сохраняются
              за Разработчиком.
            </Body>
          </Section>

          <Section title="5. Допустимое использование">
            <Body>
              Вы обязуетесь не использовать Приложение в незаконных целях, не пытаться
              декомпилировать, модифицировать, взламывать или иным образом вмешиваться в его работу,
              а также не нарушать права других лиц при его использовании.
            </Body>
          </Section>

          <Section title="6. Отказ от гарантий">
            <Body>
              Приложение предоставляется на условиях «как есть» и «как доступно», без каких-либо
              гарантий, явных или подразумеваемых. Разработчик не гарантирует бесперебойную,
              безошибочную или безопасную работу Приложения.
            </Body>
          </Section>

          <Section title="7. Ограничение ответственности">
            <Body>
              В максимально допустимой законом степени Разработчик не несёт ответственности за любые
              прямые, косвенные, случайные или иные убытки, возникшие в результате использования или
              невозможности использования Приложения.
            </Body>
          </Section>

          <Section title="8. Изменения условий">
            <Body>
              Разработчик вправе время от времени обновлять настоящие Условия. Актуальная редакция
              публикуется в Приложении. Продолжая использовать Приложение после внесения изменений,
              вы соглашаетесь с обновлёнными Условиями.
            </Body>
          </Section>

          <Section title="9. Применимое право">
            <Body>
              Настоящие Условия регулируются и толкуются в соответствии с законодательством{' '}
              {JURISDICTION}, без учёта коллизионных норм.
            </Body>
          </Section>

          <Section title="10. Контакты">
            <Body>
              По вопросам, связанным с настоящими Условиями, вы можете связаться с Разработчиком по
              адресу: {CONTACT_EMAIL}.
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
