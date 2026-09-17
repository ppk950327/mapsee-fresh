import { useEffect, useState } from 'react';
import {
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { SeoulQuest } from '../../data/seoulQuests';

type QuestDetailModalProps = {
  visible: boolean;
  quest: SeoulQuest | null;
  onClose: () => void;
  onCheckIn?: (quest: SeoulQuest) => void;
};

export default function QuestDetailModal({
  visible,
  quest,
  onClose,
  onCheckIn,
}: QuestDetailModalProps) {
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    setCheckedIn(false);
  }, [quest?.id, visible]);

  if (!quest) {
    return null;
  }

  const handleCheckIn = () => {
    setCheckedIn(true);

    if (onCheckIn) {
      onCheckIn(quest);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>

          {quest.type === 'special' && (
            <View style={styles.specialBadge}>
              <Text style={styles.specialText}>
                SPECIAL MUSEUM QUEST
              </Text>
            </View>
          )}

          <Text style={styles.district}>
            {quest.district}
          </Text>

          <View style={styles.itemArea}>
            <Image
              source={quest.itemImage}
              style={styles.itemImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.artifactTitle}>
            {quest.title}
          </Text>

          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              QUEST
            </Text>

            <Text style={styles.progressValue}>
              {quest.progress} / {quest.total}
            </Text>
          </View>

          {checkedIn && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                ✓ Check-in successful!
              </Text>

              <Text style={styles.successSubText}>
                GPS verification will be connected later.
              </Text>
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.checkInButton,
              pressed && styles.buttonPressed,
              checkedIn && styles.checkedButton,
            ]}
            onPress={handleCheckIn}
          >
            <Text style={styles.checkInButtonText}>
              {checkedIn ? 'CHECKED IN' : 'CHECK IN'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onClose}
          >
            <Text style={styles.closeText}>
              Close
            </Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(36, 24, 15, 0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  card: {
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderRadius: 22,
    backgroundColor: '#FFF5DB',
    borderWidth: 3,
    borderColor: '#B47A43',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 8,
  },

  specialBadge: {
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: '#D9A23D',
    borderWidth: 1,
    borderColor: '#805327',
  },

  specialText: {
    color: '#FFF9E9',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  district: {
    color: '#432A19',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },

  itemArea: {
    width: 126,
    height: 126,
    marginTop: 14,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemImage: {
    width: 116,
    height: 116,
  },

  artifactTitle: {
    maxWidth: 280,
    color: '#6B4A31',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
  },

  progressRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  progressLabel: {
    color: '#A06E3E',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },

  progressValue: {
    color: '#432A19',
    fontSize: 16,
    fontWeight: '900',
  },

  successBox: {
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1E9C9',
    borderWidth: 1,
    borderColor: '#B8A56A',
    alignItems: 'center',
  },

  successText: {
    color: '#5B6834',
    fontSize: 12,
    fontWeight: '900',
  },

  successSubText: {
    marginTop: 3,
    color: '#817356',
    fontSize: 9,
    textAlign: 'center',
  },

  checkInButton: {
    width: '100%',
    marginTop: 18,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#DE7978',
    borderWidth: 2,
    borderColor: '#A84F50',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkedButton: {
    backgroundColor: '#A7B77D',
    borderColor: '#71804F',
  },

  checkInButtonText: {
    color: '#FFF9ED',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  closeButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  closeText: {
    color: '#795A40',
    fontSize: 12,
    fontWeight: '700',
  },

  buttonPressed: {
    opacity: 0.7,
  },
});