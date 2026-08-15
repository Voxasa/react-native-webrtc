#import <objc/runtime.h>

#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>

#import "WebRTCModule.h"

@implementation WebRTCModule (RTCAudioSession)

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(audioSessionDidActivate) {
    [[RTCAudioSession sharedInstance] audioSessionDidActivate:[AVAudioSession sharedInstance]];
    return nil;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(audioSessionDidDeactivate) {
    [[RTCAudioSession sharedInstance] audioSessionDidDeactivate:[AVAudioSession sharedInstance]];
    return nil;
}

// Manual audio mode stops WebRTC initializing the audio unit as soon as a track is ready
// for playout or recording, so that a CallKit application can start audio only after
// CallKit has activated and configured the shared AVAudioSession. Must be set before any
// activation; setting it per call is not equivalent.
//
// Exported synchronously for the same reason the two methods above are: callers use these
// to order the audio unit against CallKit's delegates, and an asynchronous hop would
// reintroduce the race they exist to remove.
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(setManualAudio : (BOOL)enabled) {
    [RTCAudioSession sharedInstance].useManualAudio = enabled;
    return nil;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getManualAudio) {
    return @([RTCAudioSession sharedInstance].useManualAudio);
}

// Permission for WebRTC to initialize and run the VoIP audio unit. Only effective while
// useManualAudio is YES.
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(setAudioEnabled : (BOOL)enabled) {
    [RTCAudioSession sharedInstance].isAudioEnabled = enabled;
    return nil;
}

// Read-only snapshot for diagnostics. Without it, callers can only infer the audio
// session's state from downstream RTP statistics, which cannot tell a unit that never
// started apart from media that carried silence.
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getAudioSessionState) {
    RTCAudioSession *rtcSession = [RTCAudioSession sharedInstance];
    AVAudioSession *avSession = [AVAudioSession sharedInstance];
    AVAudioSessionRouteDescription *route = avSession.currentRoute;

    return @{
        @"useManualAudio" : @(rtcSession.useManualAudio),
        @"isAudioEnabled" : @(rtcSession.isAudioEnabled),
        @"isActive" : @(rtcSession.isActive),
        @"category" : avSession.category ?: @"",
        @"mode" : avSession.mode ?: @"",
        @"categoryOptions" : @(avSession.categoryOptions),
        @"sampleRate" : @(avSession.sampleRate),
        // AVAudioSession capitalises the getter `IOBufferDuration`, while the setter is
        // `setPreferredIOBufferDuration:`. The lowercase spelling does not compile.
        @"ioBufferDuration" : @(avSession.IOBufferDuration),
        @"inputNumberOfChannels" : @(avSession.inputNumberOfChannels),
        @"outputNumberOfChannels" : @(avSession.outputNumberOfChannels),
        @"inputPortType" : route.inputs.firstObject.portType ?: @"",
        @"outputPortType" : route.outputs.firstObject.portType ?: @"",
    };
}

@end
