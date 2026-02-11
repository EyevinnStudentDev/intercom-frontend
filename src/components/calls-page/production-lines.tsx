import { CallState } from "../../global-state/types";
import { CallData } from "../../hooks/use-call-list";
import { ProductionLine } from "../production-line/production-line";

type ProductionLinesProps = {
  calls: Record<string, CallState>;
  callOrder: string[];
  shouldReduceVolume: boolean;
  isSingleCall: boolean;
  customGlobalMute: string;
  isMasterInputMuted: boolean;
  callActionHandlers: React.MutableRefObject<
    Record<string, Record<string, () => void>>
  >;
  isSettingGlobalMute: boolean;
  setAddCallActive: (addCallActive: boolean) => void;
  registerCallList: (
    callId: string,
    data: CallData,
    isSettingGlobalMute?: boolean
  ) => void;
  deregisterCall: (callId: string) => void;
};

export const ProductionLines = ({
  calls,
  callOrder,
  shouldReduceVolume,
  isSingleCall,
  customGlobalMute,
  isMasterInputMuted,
  callActionHandlers,
  isSettingGlobalMute,
  setAddCallActive,
  registerCallList,
  deregisterCall,
}: ProductionLinesProps) => {
  return (
    <>
      {callOrder.map( (callId, i) => {
        const callState = calls[callId];
        const currentIndex = i;
        if (!callState?.joinProductionOptions) {
          return null;
        }
        return (
            <ProductionLine
              key={callId}
              id={callId}
              shouldReduceVolume={shouldReduceVolume}
              callState={callState}
              currentCallOrderIndex={currentIndex}
              isSingleCall={isSingleCall}
              customGlobalMute={customGlobalMute}
              masterInputMute={isMasterInputMuted}
              setFailedToConnect={() => setAddCallActive(true)}
              isSettingGlobalMute={isSettingGlobalMute}
              callActionHandlers={callActionHandlers}
              registerCallList={registerCallList}
              deregisterCall={deregisterCall}
            />
        );
      })}
    </>
  );
};
