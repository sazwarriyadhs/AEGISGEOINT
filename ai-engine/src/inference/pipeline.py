import numpy as np

class AegisPipeline:

    def process(self, detection):

        enriched = self.enrich(detection)
        scored = self.score(enriched)
        classified = self.classify(scored)

        return classified

    def enrich(self, d):

        d["risk_context"] = {
            "border_zone": True if d["lat"] < -3.0 else False,
            "density": np.random.randint(1, 100)
        }

        return d

    def score(self, d):

        base = d["confidence"] * 100

        if d["risk_context"]["border_zone"]:
            base += 20

        d["risk_score"] = min(base, 100)

        return d

    def classify(self, d):

        if d["risk_score"] > 80:
            d["threat_level"] = "HIGH"
        elif d["risk_score"] > 50:
            d["threat_level"] = "MEDIUM"
        else:
            d["threat_level"] = "LOW"

        return d