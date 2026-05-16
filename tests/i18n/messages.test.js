import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, translate } from '~/i18n/messages';

describe('i18n messages', () => {
    it('defaults to Chinese', () => {
        expect(DEFAULT_LOCALE).toBe('zh-CN');
        expect(translate(DEFAULT_LOCALE, 'placeholder.defaultProjectName')).toBe('未命名项目');
    });

    it('translates English messages', () => {
        expect(translate('en-US', 'placeholder.defaultProjectName')).toBe('Untitled Project');
    });

    it('replaces message parameters', () => {
        expect(translate('en-US', 'notification.savedFile', { file: 'snippet.png' })).toBe(
            'Saved snippet.png'
        );
    });

    it('falls back to the key when a message is missing', () => {
        expect(translate('zh-CN', 'missing.key')).toBe('missing.key');
    });
});
