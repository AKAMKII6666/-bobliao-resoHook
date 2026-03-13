import { renderHook, act } from '@testing-library/react-hooks';
import { useReso } from '../src';
import { EresoMode } from '../src/iReso';

describe('useReso', () => {
  it('should initialize with default config', () => {
    const { result } = renderHook(() =>
      useReso({
        fontSize: 16,
        designWidth: 1920,
        designHeight: 1080,
      })
    );

    expect(result.current.width).toBeDefined();
    expect(result.current.height).toBeDefined();
    expect(result.current.fontSize).toBeDefined();
    expect(result.current.screenState).toBeDefined();
  });

  it('should accept EresoMode config', () => {
    const { result } = renderHook(() =>
      useReso({
        fontSize: 16,
        designWidth: 1920,
        designHeight: 1080,
        mode: EresoMode.AUTO,
      })
    );

    expect(result.current.width).toBeDefined();
  });

  it('should return data with helTags and elemsnts', () => {
    const { result } = renderHook(() =>
      useReso({
        fontSize: 16,
        designWidth: 1920,
        designHeight: 1080,
      })
    );

    expect(result.current.data).toBeDefined();
    expect(result.current.data.helTags).toBeDefined();
    expect(result.current.data.elemsnts).toBeDefined();
    expect(result.current.data.scriptStr).toBeDefined();
  });

  it('should return funcs object', () => {
    const { result } = renderHook(() =>
      useReso({
        fontSize: 16,
        designWidth: 1920,
        designHeight: 1080,
      })
    );

    expect(result.current.funcs).toBeDefined();
    expect(typeof result.current.funcs).toBe('object');
  });
});
