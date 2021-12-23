import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "store/root-reducer";
import './slider.scss'

interface IProps extends PropsFromRedux {}

const Slider = (props: IProps) => {
  const [sliderImages, setSliderImages] = React.useState<any>([]);

  const [x, setX] = React.useState(0);
  const switchPrev = () => {
    x === 0 ? setX(-100 * (sliderImages.length - 1)) : setX(x + 100);
  };

  const switchNext = () => {
    x === -100 * (sliderImages.length - 1) ? setX(0) : setX(x - 100);
  };

  React.useEffect(() => {
    if (props.sliderImages && props.sliderImages instanceof Array) { 
      const imageArr = props.sliderImages.map((item, index) => (
        <SliderImage src={item.image} alt="banner1" key={index} />
      ));

      setSliderImages(imageArr);
    } else {
      setSliderImages([]);
    }
  }, [props.sliderImages]);

  return (
    <>
      <div className="slider">
        {sliderImages?.map((item, i) => (
          <div className="slide" key={i} style={{ transform: `translateX(${x}%)` }}>
            {item}
          </div>
        ))}
        <button className="slider__button previous__button" onClick={switchPrev}>
          {/* <GrPrevious /> */} &#xab;
        </button>
        <button className="slider__button next__button" onClick={switchNext}>
          {/* <GrNext /> */} &#xbb;
        </button>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  sliderImages: state.incomeData.getIncomeExpenseImgae.data,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Slider);

export const SliderImage = ({ src, alt }) => {
  return <img src={src} alt={alt} className="slider__image" />;
};
