// src/hooks/useSecureCode.ts
// PIN de acceso a bodega guardado en SecureStore (Keychain / Keystore).
// Nunca se escribe en AsyncStorage ni en MMKV, y el valor leído
// solo se usa para comparar: jamás se expone ni se muestra en pantalla.

import { useCallback, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const WAREHOUSE_PIN_KEY = 'warehouse_pin';
const MIN_PIN_LENGTH = 4;

function isValidPin(code: string): boolean {
  return new RegExp(`^\\d{${MIN_PIN_LENGTH},}$`).test(code.trim());
}

export function useSecureCode() {
  const [hasCode, setHasCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar solo comprobamos si existe; no guardamos el valor en estado.
  useEffect(() => {
    let mounted = true;

    async function checkExistingCode(): Promise<void> {
      try {
        const stored = await SecureStore.getItemAsync(WAREHOUSE_PIN_KEY);
        if (mounted) setHasCode(stored !== null);
      } catch {
        if (mounted) setHasCode(false);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void checkExistingCode();
    return () => {
      mounted = false;
    };
  }, []);

  const saveCode = useCallback(async (code: string): Promise<boolean> => {
    if (!isValidPin(code)) return false;

    try {
      await SecureStore.setItemAsync(WAREHOUSE_PIN_KEY, code.trim());
      setHasCode(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const verifyCode = useCallback(async (code: string): Promise<boolean> => {
    try {
      const stored = await SecureStore.getItemAsync(WAREHOUSE_PIN_KEY);
      return stored !== null && stored === code.trim();
    } catch {
      return false;
    }
  }, []);

  const removeCode = useCallback(async (): Promise<boolean> => {
    try {
      await SecureStore.deleteItemAsync(WAREHOUSE_PIN_KEY);
      setHasCode(false);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { hasCode, isLoading, saveCode, verifyCode, removeCode };
}
