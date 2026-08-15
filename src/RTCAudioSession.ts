import { NativeModules, Platform } from 'react-native';

const { WebRTCModule } = NativeModules;

/**
 * A snapshot of the shared audio session, for diagnostics.
 *
 * Without this the only way to reason about the audio session from JS is to infer it
 * from downstream RTP statistics, which cannot distinguish "the unit never started"
 * from "the media was silent".
 */
export interface RTCAudioSessionState {
    /** Whether WebRTC is waiting for `setAudioEnabled` rather than starting on its own. */
    useManualAudio: boolean;
    /** Whether WebRTC currently has permission to run the VoIP audio unit. */
    isAudioEnabled: boolean;
    /** RTCAudioSession's best guess at whether AVAudioSession is active. */
    isActive: boolean;
    category: string;
    mode: string;
    categoryOptions: number;
    sampleRate: number;
    ioBufferDuration: number;
    inputNumberOfChannels: number;
    outputNumberOfChannels: number;
    inputPortType: string;
    outputPortType: string;
}

export default class RTCAudioSession {
    /**
     * To be called when CallKit activates the audio session.
     */
    static audioSessionDidActivate() {
        // Only valid for iOS
        if (Platform.OS === 'ios') {
            WebRTCModule.audioSessionDidActivate();
        }
    }

    /**
     * To be called when CallKit deactivates the audio session.
     */
    static audioSessionDidDeactivate() {
        // Only valid for iOS
        if (Platform.OS === 'ios') {
            WebRTCModule.audioSessionDidDeactivate();
        }
    }

    /**
     * When enabled, WebRTC will not initialize the audio unit as soon as a track becomes
     * ready for playout or recording; the application grants permission explicitly via
     * `setAudioEnabled` instead.
     *
     * This is what a CallKit application needs: CallKit owns activation of the shared
     * AVAudioSession and reconfigures it from its own delegates, so an audio unit started
     * before that has landed will have the reconfiguration applied underneath it.
     *
     * Must be set before any audio session activation. Setting it per call is not
     * equivalent — by then the unit may already have started.
     */
    static setManualAudio(enabled: boolean): void {
        // Only valid for iOS
        if (Platform.OS === 'ios') {
            WebRTCModule.setManualAudio(enabled);
        }
    }

    /**
     * Whether manual audio mode is currently on. Always false off iOS.
     */
    static getManualAudio(): boolean {
        return Platform.OS === 'ios' ? WebRTCModule.getManualAudio() : false;
    }

    /**
     * Permission for WebRTC to initialize and run the VoIP audio unit. Only effective
     * while manual audio mode is on.
     *
     * Setting it to false stops and uninitializes the unit if it is running, which ends
     * both incoming and outgoing audio. Setting it to true lets WebRTC start the unit
     * when a connection needs it.
     */
    static setAudioEnabled(enabled: boolean): void {
        // Only valid for iOS
        if (Platform.OS === 'ios') {
            WebRTCModule.setAudioEnabled(enabled);
        }
    }

    /**
     * Current state of the shared audio session. Returns null off iOS.
     */
    static getAudioSessionState(): RTCAudioSessionState | null {
        return Platform.OS === 'ios' ? WebRTCModule.getAudioSessionState() : null;
    }
}
