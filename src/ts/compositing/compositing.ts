abstract class CompositingBase {
    public backgroundColor: string;
    public foregroundColor: string;

    public abstract initialize(): void;
    public abstract bindTopLayer(): void;
    public abstract compose(): void;
    public abstract updateColors(): void;
}

export default CompositingBase;
