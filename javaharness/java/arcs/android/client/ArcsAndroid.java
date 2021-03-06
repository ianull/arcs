package arcs.android.client;

import javax.inject.Inject;

import arcs.android.api.IRemotePecCallback;
import arcs.api.ArcData;
import arcs.api.Arcs;
import arcs.api.PECInnerPort;
import arcs.api.PecPortManager;
import arcs.api.PortableJsonParser;
import arcs.api.UiBroker;

// This class implements Arcs API for callers running in Android service
// different that the one hosting the Arcs Runtime.
public class ArcsAndroid implements Arcs {

  private final ArcsServiceBridge bridge;
  private final PecPortManager pecPortManager;
  private final PortableJsonParser jsonParser;
  private final UiBroker uiBroker;

  @Inject
  ArcsAndroid(
      ArcsServiceBridge bridge,
      PecPortManager pecPortManager,
      PortableJsonParser jsonParser,
      UiBroker uiBroker) {
    this.bridge = bridge;
    this.pecPortManager = pecPortManager;
    this.jsonParser = jsonParser;
    this.uiBroker = uiBroker;
  }

  @Override
  public void runArc(ArcData arcData) {
    PECInnerPort pecInnerPort =
        pecPortManager.getOrCreateInnerPort(arcData.getPecId(), arcData.getSessionId());
    if (arcData.getParticle() != null) {
      pecInnerPort.mapParticle(arcData.getParticle());
    }

    bridge.startArc(arcData, createPecCallback(pecInnerPort));
  }

  @Override
  public void stopArc(ArcData arcData) {
    bridge.stopArc(arcData.getArcId(), arcData.getPecId());
  }

  @Override
  public UiBroker getUiBroker() {
    return uiBroker;
  }

  private IRemotePecCallback createPecCallback(PECInnerPort pecInnerPort) {
    return new IRemotePecCallback.Stub() {
      @Override
      public void onMessage(String message) {
        pecInnerPort.onReceivePecMessage(jsonParser.parse(message));
      }
    };
  }
}
