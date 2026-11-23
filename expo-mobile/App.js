import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

// Local dev server IP broadcasted by Vite
const SERVER_URL = 'http://192.168.1.74:3000';

export default function App() {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleReload = () => {
    setHasError(false);
    setLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#171421" />

      {hasError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>◆ PENGHUBUNG TEYVAT TERPUTUS ◆</Text>
          <Text style={styles.errorDesc}>
            Gagal terhubung ke server Vite lokal:{'\n'}
            <Text style={styles.urlText}>{SERVER_URL}</Text>
          </Text>
          <Text style={styles.errorTip}>
            Pastikan HP dan laptop Axioo Pongo terhubung ke jaringan Wi-Fi yang sama, dan dev server Vite aktif di port 3000.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleReload} activeOpacity={0.8}>
            <Text style={styles.retryText}>Hubungkan Ulang</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.webviewContainer}>
          <WebView
            ref={webViewRef}
            source={{ uri: SERVER_URL }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            originWhitelist={['*']}
            mixedContentMode="always"
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              setLoading(false);
              setHasError(true);
              setErrorMessage(nativeEvent.description || 'Koneksi gagal');
            }}
          />

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFE7A5" />
              <Text style={styles.loadingText}>Memasuki Gerbang Celestia...</Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120F1D',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#171421',
  },
  webview: {
    flex: 1,
    backgroundColor: '#171421',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#120F1D',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 14,
    color: '#FFE7A5',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#120F1D',
  },
  errorTitle: {
    color: '#FFE7A5',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
    textAlign: 'center',
  },
  errorDesc: {
    color: '#E9E5DC',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  urlText: {
    color: '#FFE7A5',
    fontWeight: 'bold',
  },
  errorTip: {
    color: '#9E94B8',
    fontSize: 11.5,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FFE7A5',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 4,
  },
  retryText: {
    color: '#241F36',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
