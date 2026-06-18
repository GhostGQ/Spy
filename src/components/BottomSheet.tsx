import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, View } from 'react-native';

import { colors } from '@/theme/colors';

interface Props {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

const OPEN_MS = 280;
const CLOSE_MS = 220;

/**
 * Bottom sheet with independently animated backdrop (fade) and sheet (slide).
 * The backdrop fades in while the sheet springs up — they never move together.
 */
export function BottomSheet({ visible, onRequestClose, children }: Props) {
  // Keep the Modal mounted during the close animation so it stays visible.
  const [mounted, setMounted] = useState(visible);
  const backdropOpacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(visible ? 0 : 600)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: OPEN_MS,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 26,
          stiffness: 220,
          mass: 0.8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: CLOSE_MS,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 600,
          duration: CLOSE_MS,
          useNativeDriver: true,
        }),
      ]).start(() => setMounted(false));
    }
  }, [visible]);

  return (
    <Modal
      visible={mounted}
      transparent
      animationType='none'
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      {/* Backdrop fades independently — pointerEvents none so sheet buttons work */}
      <Animated.View
        pointerEvents='none'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          opacity: backdropOpacity,
        }}
      />

      {/* Sheet slides up independently */}
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Animated.View
          style={{
            transform: [{ translateY }],
            borderTopWidth: 1,
            borderTopColor: colors.borderSubtle,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: colors.surface,
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 40,
          }}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
